import { Product } from './products-data';
import { PRODUCT_CATEGORIES, getCategoryByKey } from './ data/categories';
import { PRODUCTS_DATABASE } from './ data/products';
import { MEASUREMENT_UNITS, MeasurementUnit } from './units';

export interface MigrationResult {
  migratedProducts: Product[];
  issues: MigrationIssue[];
  hasChanges: boolean;
  cleanedDeletedProducts?: string[]; // ID продуктов, которые были очищены из списка удаленных
}

export interface MigrationIssue {
  type: 'invalid_id' | 'invalid_category' | 'missing_field' | 'extra_field' | 'invalid_value' | 'deleted_product_cleanup';
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

// Проверяет, является ли строка валидным типом единицы измерения
function isValidUnitType(type: string): boolean {
  const validTypes = ['grams', 'pieces', 'spoons', 'slices'];
  return validTypes.includes(type);
}

// Проверяет, является ли значение валидным размером для данного типа
function isValidSize(type: string, size: any): boolean {
  if (type === 'pieces') {
    return size === undefined || ['small', 'medium', 'large'].includes(size);
  }
  if (type === 'spoons') {
    return size === undefined || ['teaspoon', 'tablespoon'].includes(size);
  }
  // Для grams и slices size должен отсутствовать
  return size === undefined;
}

// Проверяет и исправляет единицы измерения
function validateMeasurementUnits(value: any): MeasurementUnit[] {
  if (!Array.isArray(value)) {
    return [];
  }
  
  const validUnits: MeasurementUnit[] = [];
  
  for (const unit of value) {
    // Базовая проверка структуры объекта
    if (!unit || typeof unit !== 'object') {
      continue;
    }

    // Проверяем обязательные поля
    if (typeof unit.type !== 'string' || 
        typeof unit.weightInGrams !== 'number' ||
        typeof unit.displayName !== 'string') {
      continue;
    }

    // Проверяем валидность типа единицы измерения
    if (!isValidUnitType(unit.type)) {
      continue;
    }

    // Проверяем вес (должен быть положительным числом, разумные пределы)
    if (isNaN(unit.weightInGrams) || 
        unit.weightInGrams <= 0 || 
        unit.weightInGrams > 10000) { // максимум 10кг для одной единицы
      continue;
    }

    // Проверяем displayName (не должно быть пустой строкой)
    if (unit.displayName.trim().length === 0) {
      continue;
    }

    // Проверяем размер для соответствующих типов
    if (!isValidSize(unit.type, unit.size)) {
      continue;
    }

    // Не сохраняем граммы - они добавляются автоматически при отображении
    if (unit.weightInGrams === 100 && unit.type === 'grams') {
      continue;
    }

    // Создаем валидный объект единицы измерения
    const validUnit: MeasurementUnit = {
      type: unit.type as any, // TypeScript cast, мы уже проверили валидность
      weightInGrams: unit.weightInGrams,
      displayName: unit.displayName.trim()
    };

    // Добавляем size только если он валиден и нужен
    if (unit.size && isValidSize(unit.type, unit.size)) {
      validUnit.size = unit.size;
    }

    validUnits.push(validUnit);
  }
  
  return validUnits;
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
  const requiredFields: (keyof Product)[] = ['name', 'category', 'calories', 'protein', 'fat', 'carbs', 'measurementUnits'];
  
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
        case 'measurementUnits':
          defaultValue = [];
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

  // Миграция со старых полей unit и pieceWeight
  if ('unit' in migratedProduct || 'pieceWeight' in migratedProduct) {
    const unit = migratedProduct.unit;
    const pieceWeight = migratedProduct.pieceWeight;
    
    let newUnits: MeasurementUnit[] = [];
    
    if (unit && pieceWeight && typeof pieceWeight === 'number' && pieceWeight > 0) {
      // Создаем единицу измерения на основе старых полей (без граммов)
      const customUnit = {
        type: 'pieces',
        weightInGrams: pieceWeight,
        displayName: `1${unit} (${pieceWeight}г)`
      };
      newUnits.push(customUnit as MeasurementUnit);
    }
    
    migratedProduct.measurementUnits = newUnits;
    delete migratedProduct.unit;
    delete migratedProduct.pieceWeight;
    
    issues.push({
      type: 'invalid_value',
      productName: migratedProduct.name,
      field: 'measurementUnits',
      originalValue: { unit, pieceWeight },
      newValue: newUnits,
      message: `Мигрированы устаревшие поля unit и pieceWeight в новую систему единиц измерения`
    });
  }

  // Проверяем и исправляем единицы измерения
  const originalUnits = migratedProduct.measurementUnits;
  const validatedUnits = validateMeasurementUnits(originalUnits);
  
  if (JSON.stringify(originalUnits) !== JSON.stringify(validatedUnits)) {
    migratedProduct.measurementUnits = validatedUnits;
    issues.push({
      type: 'invalid_value',
      productName: migratedProduct.name,
      field: 'measurementUnits',
      originalValue: originalUnits,
      newValue: validatedUnits,
      message: `Исправлены единицы измерения: удалены граммы (добавляются автоматически) и некорректные единицы`
    });
  }

  // Удаляем лишние поля
  const allowedFields = new Set(['id', 'name', 'category', 'calories', 'protein', 'fat', 'carbs', 'measurementUnits']);
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

// Функция для проверки и очистки удаленных системных продуктов
export function cleanupDeletedSystemProducts(): { cleanedIds: string[]; issues: MigrationIssue[] } {
  if (typeof window === 'undefined') {
    return { cleanedIds: [], issues: [] };
  }

  try {
    const stored = localStorage.getItem('deleted_system_products');
    if (!stored) {
      return { cleanedIds: [], issues: [] };
    }

    const deletedProductIds: string[] = JSON.parse(stored);
    const systemProductIds = new Set(PRODUCTS_DATABASE.map(p => p.id));
    
    // Находим ID которые больше не существуют в системной базе
    const validDeletedIds: string[] = [];
    const invalidIds: string[] = [];
    
    for (const id of deletedProductIds) {
      if (systemProductIds.has(id)) {
        validDeletedIds.push(id);
      } else {
        invalidIds.push(id);
      }
    }
    
    const issues: MigrationIssue[] = [];
    
    // Если есть невалидные ID, сохраняем только валидные и создаем уведомления
    if (invalidIds.length > 0) {
      try {
        localStorage.setItem('deleted_system_products', JSON.stringify(validDeletedIds));
        
        for (const invalidId of invalidIds) {
          issues.push({
            type: 'deleted_product_cleanup',
            originalId: invalidId,
            message: `Удален из списка скрытых несуществующий продукт с ID "${invalidId}"`
          });
        }
      } catch (saveError) {
        console.error('Ошибка при сохранении очищенного списка удаленных продуктов:', saveError);
      }
    }
    
    return { cleanedIds: invalidIds, issues };
  } catch (error) {
    console.error('Ошибка при очистке удаленных системных продуктов:', error);
    return { cleanedIds: [], issues: [] };
  }
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
    invalid_value: '⚠️ Некорректные значения',
    deleted_product_cleanup: '🧹 Очистка удаленных продуктов'
  };

  for (const [type, typeIssues] of Object.entries(groupedIssues)) {
    report.push(`\n${typeNames[type] || type}:`);
    typeIssues.forEach((issue, index) => {
      report.push(`  ${index + 1}. ${issue.message}`);
    });
  }

  return report.join('\n');
}
