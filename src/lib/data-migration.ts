import { Product } from './products-data';
import { PRODUCT_CATEGORIES, getCategoryByKey } from './ data/categories';

export interface MigrationResult {
  migratedProducts: Product[];
  issues: MigrationIssue[];
  hasChanges: boolean;
}

export interface MigrationIssue {
  type: 'invalid_id' | 'invalid_category' | 'missing_field' | 'extra_field' | 'invalid_value';
  productName?: string;
  originalId?: string;
  newId?: string;
  field?: string;
  originalValue?: any;
  newValue?: any;
  message: string;
}

// Проверяет, является ли строка валидным UUID v4
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

// Генерирует новый UUID v4
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Проверяет, существует ли категория
function isValidCategory(categoryKey: string): boolean {
  return getCategoryByKey(categoryKey) !== undefined;
}

// Проверяет, является ли значение валидным числом >= 0
function isValidNumber(value: any): boolean {
  return typeof value === 'number' && !isNaN(value) && value >= 0;
}

// Валидирует и мигрирует один продукт
function migrateProduct(product: any): { product: Product; issues: MigrationIssue[] } {
  const issues: MigrationIssue[] = [];
  let migratedProduct: any = { ...product };

  // Проверяем и исправляем ID
  if (!product.id || typeof product.id !== 'string' || !isValidUUID(product.id)) {
    const newId = generateUUID();
    issues.push({
      type: 'invalid_id',
      productName: product.name || 'Неизвестный продукт',
      originalId: product.id,
      newId,
      message: `Заменен некорректный ID "${product.id}" на валидный UUID "${newId}"`
    });
    migratedProduct.id = newId;
  }

  // Проверяем обязательные поля
  const requiredFields: (keyof Product)[] = ['name', 'category', 'calories', 'protein', 'fat', 'carbs'];
  
  for (const field of requiredFields) {
    if (!(field in migratedProduct)) {
      let defaultValue: any;
      switch (field) {
        case 'name':
          defaultValue = 'Новый продукт';
          break;
        case 'category':
          defaultValue = PRODUCT_CATEGORIES.UNCATEGORIZED.key;
          break;
        case 'calories':
        case 'protein':
        case 'fat':
        case 'carbs':
          defaultValue = 0;
          break;
      }
      
      migratedProduct[field] = defaultValue;
      issues.push({
        type: 'missing_field',
        productName: migratedProduct.name,
        field,
        newValue: defaultValue,
        message: `Добавлено отсутствующее поле "${field}" со значением по умолчанию "${defaultValue}"`
      });
    }
  }

  // Проверяем тип name
  if (typeof migratedProduct.name !== 'string') {
    const newName = String(migratedProduct.name || 'Новый продукт');
    issues.push({
      type: 'invalid_value',
      productName: migratedProduct.name,
      field: 'name',
      originalValue: migratedProduct.name,
      newValue: newName,
      message: `Исправлено некорректное значение поля "name": "${migratedProduct.name}" → "${newName}"`
    });
    migratedProduct.name = newName;
  }

  // Проверяем и исправляем категорию
  if (!isValidCategory(migratedProduct.category)) {
    const originalCategory = migratedProduct.category;
    migratedProduct.category = PRODUCT_CATEGORIES.UNCATEGORIZED.key;
    issues.push({
      type: 'invalid_category',
      productName: migratedProduct.name,
      field: 'category',
      originalValue: originalCategory,
      newValue: PRODUCT_CATEGORIES.UNCATEGORIZED.key,
      message: `Заменена несуществующая категория "${originalCategory}" на категорию по умолчанию "${PRODUCT_CATEGORIES.UNCATEGORIZED.name}"`
    });
  }

  // Проверяем числовые поля
  const numericFields: (keyof Product)[] = ['calories', 'protein', 'fat', 'carbs'];
  
  for (const field of numericFields) {
    if (!isValidNumber(migratedProduct[field])) {
      const originalValue = migratedProduct[field];
      migratedProduct[field] = 0;
      issues.push({
        type: 'invalid_value',
        productName: migratedProduct.name,
        field,
        originalValue,
        newValue: 0,
        message: `Исправлено некорректное значение поля "${field}": "${originalValue}" → 0`
      });
    }
  }

  // Удаляем лишние поля
  const allowedFields = new Set(['id', 'name', 'category', 'calories', 'protein', 'fat', 'carbs']);
  for (const field in migratedProduct) {
    if (!allowedFields.has(field)) {
      delete migratedProduct[field];
      issues.push({
        type: 'extra_field',
        productName: migratedProduct.name,
        field,
        originalValue: product[field],
        message: `Удалено лишнее поле "${field}" со значением "${product[field]}"`
      });
    }
  }

  return {
    product: migratedProduct as Product,
    issues
  };
}

// Основная функция миграции данных пользователя
export function migrateUserProducts(rawData: any[]): MigrationResult {
  if (!Array.isArray(rawData)) {
    return {
      migratedProducts: [],
      issues: [{
        type: 'invalid_value',
        message: 'Данные пользователя не являются массивом, создан пустой список продуктов'
      }],
      hasChanges: true
    };
  }

  const migratedProducts: Product[] = [];
  const allIssues: MigrationIssue[] = [];
  let hasChanges = false;

  for (const rawProduct of rawData) {
    if (!rawProduct || typeof rawProduct !== 'object') {
      allIssues.push({
        type: 'invalid_value',
        message: `Пропущен некорректный элемент: ${JSON.stringify(rawProduct)}`
      });
      hasChanges = true;
      continue;
    }

    const { product, issues } = migrateProduct(rawProduct);
    migratedProducts.push(product);
    allIssues.push(...issues);
    
    if (issues.length > 0) {
      hasChanges = true;
    }
  }

  // Проверяем на дублированные ID
  const seenIds = new Set<string>();
  for (let i = 0; i < migratedProducts.length; i++) {
    const product = migratedProducts[i];
    if (seenIds.has(product.id)) {
      const newId = generateUUID();
      allIssues.push({
        type: 'invalid_id',
        productName: product.name,
        originalId: product.id,
        newId,
        message: `Обнаружен дублированный ID "${product.id}", заменен на "${newId}"`
      });
      migratedProducts[i] = { ...product, id: newId };
      hasChanges = true;
    } else {
      seenIds.add(product.id);
    }
  }

  return {
    migratedProducts,
    issues: allIssues,
    hasChanges
  };
}

// Утилита для отображения отчета о миграции
export function formatMigrationReport(issues: MigrationIssue[]): string {
  if (issues.length === 0) {
    return 'Данные корректны, изменений не требуется.';
  }

  const report: string[] = [];
  report.push(`Обнаружено и исправлено ${issues.length} проблем:`);
  
  const groupedIssues = issues.reduce((acc, issue) => {
    const key = issue.type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(issue);
    return acc;
  }, {} as Record<string, MigrationIssue[]>);

  const typeNames: Record<string, string> = {
    invalid_id: '🔑 Некорректные ID',
    invalid_category: '📂 Неверные категории',
    missing_field: '➕ Отсутствующие поля',
    extra_field: '➖ Лишние поля',
    invalid_value: '⚠️ Некорректные значения'
  };

  for (const [type, typeIssues] of Object.entries(groupedIssues)) {
    report.push(`\n${typeNames[type] || type}:`);
    typeIssues.forEach((issue, index) => {
      report.push(`  ${index + 1}. ${issue.message}`);
    });
  }

  return report.join('\n');
}
