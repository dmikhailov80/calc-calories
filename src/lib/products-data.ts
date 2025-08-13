export interface Product {
  id: string;
  name: string;
  category: string;
  calories: number; // kcal per 100g
  protein: number;  // g per 100g
  fat: number;      // g per 100g
  carbs: number;    // g per 100g
}

// Импортируем данные из отдельных файлов
import { PRODUCT_CATEGORIES } from './ data/categories';
import { PRODUCTS_DATABASE } from './ data/products';
import { migrateUserProducts, formatMigrationReport, cleanupDeletedSystemProducts, type MigrationResult } from './data-migration';

// Экспортируем для совместимости с существующим кодом
export { PRODUCT_CATEGORIES };
export const PRODUCTS_DATA: Product[] = PRODUCTS_DATABASE;

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS_DATA.filter(product => product.category === category);
}

export function getAllCategories(): string[] {
  return Object.values(PRODUCT_CATEGORIES).map(category => category.name);
}

export function getCategoryName(categoryKey: string): string {
  const category = PRODUCT_CATEGORIES[categoryKey];
  return category ? category.name : categoryKey;
}

export function getCategoryKey(categoryName: string): string {
  const categoryEntry = Object.values(PRODUCT_CATEGORIES).find(cat => cat.name === categoryName);
  return categoryEntry ? categoryEntry.key : categoryName;
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS_DATA.find(product => product.id === id);
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase();
  const allProducts = getAllProducts();
  return allProducts.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery)
  );
}

// Функции для работы с пользовательскими продуктами в localStorage
const USER_PRODUCTS_KEY = 'user_products';

export function getUserProducts(): Product[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(USER_PRODUCTS_KEY);
    if (!stored) return [];
    
    const rawData = JSON.parse(stored);
    const migrationResult = migrateUserProducts(rawData);
    
    // Проверяем и очищаем удаленные системные продукты
    const cleanupResult = cleanupDeletedSystemProducts();
    
    // Объединяем проблемы миграции и очистки
    const allIssues = [...migrationResult.issues, ...cleanupResult.issues];
    const hasChanges = migrationResult.hasChanges || cleanupResult.cleanedIds.length > 0;
    
    // Если были найдены проблемы, сохраняем исправленные данные и уведомляем пользователя
    if (hasChanges) {
      try {
        localStorage.setItem(USER_PRODUCTS_KEY, JSON.stringify(migrationResult.migratedProducts));
        
        // Сохраняем отчет о миграции для показа пользователю
        const report = formatMigrationReport(allIssues);
        localStorage.setItem('migration_report', JSON.stringify({
          timestamp: new Date().toISOString(),
          report
        }));
        
        console.warn('Обнаружены проблемы в данных пользователя:', report);
      } catch (saveError) {
        console.error('Ошибка при сохранении исправленных данных:', saveError);
      }
    }
    
    return migrationResult.migratedProducts;
  } catch (error) {
    console.error('Ошибка при загрузке пользовательских продуктов:', error);
    return [];
  }
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function saveUserProduct(product: Omit<Product, 'id'>): Product {
  const userProducts = getUserProducts();
  const newId = generateUUID();
  const newProduct: Product = {
    ...product,
    id: newId
  };
  
  const updatedProducts = [...userProducts, newProduct];
  
  try {
    localStorage.setItem(USER_PRODUCTS_KEY, JSON.stringify(updatedProducts));
    return newProduct;
  } catch (error) {
    console.error('Ошибка при сохранении продукта:', error);
    throw new Error('Не удалось сохранить продукт');
  }
}

export function deleteUserProduct(productId: string): boolean {
  // Если это системный продукт, помечаем его как удаленный
  if (!isUserProduct(productId)) {
    const deletedProducts = getDeletedSystemProducts();
    if (!deletedProducts.includes(productId)) {
      deletedProducts.push(productId);
      try {
        localStorage.setItem('deleted_system_products', JSON.stringify(deletedProducts));
        return true;
      } catch (error) {
        console.error('Ошибка при удалении системного продукта:', error);
        return false;
      }
    }
    return true;
  }

  // Если это пользовательский продукт, удаляем его физически
  const userProducts = getUserProducts();
  const filteredProducts = userProducts.filter(p => p.id !== productId);
  
  try {
    localStorage.setItem(USER_PRODUCTS_KEY, JSON.stringify(filteredProducts));
    return true;
  } catch (error) {
    console.error('Ошибка при удалении продукта:', error);
    return false;
  }
}

function getDeletedSystemProducts(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('deleted_system_products');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Ошибка при загрузке удаленных системных продуктов:', error);
    return [];
  }
}

export function updateUserProduct(productId: string, updatedProduct: Omit<Product, 'id'>): Product | null {
  const userProducts = getUserProducts();
  
  // Если это системный продукт, добавляем его как модифицированный в user_products
  if (!isUserProduct(productId)) {
    const updated: Product = {
      ...updatedProduct,
      id: productId
    };
    
    // Проверяем, есть ли уже этот продукт в user_products
    const existingIndex = userProducts.findIndex(p => p.id === productId);
    
    if (existingIndex !== -1) {
      // Обновляем существующий
      userProducts[existingIndex] = updated;
    } else {
      // Добавляем новый модифицированный продукт
      userProducts.push(updated);
    }
    
    try {
      localStorage.setItem(USER_PRODUCTS_KEY, JSON.stringify(userProducts));
      return updated;
    } catch (error) {
      console.error('Ошибка при обновлении системного продукта:', error);
      return null;
    }
  }

  // Если это пользовательский продукт, обновляем как обычно
  const productIndex = userProducts.findIndex(p => p.id === productId);
  
  if (productIndex === -1) return null;
  
  const updated: Product = {
    ...updatedProduct,
    id: productId
  };
  
  userProducts[productIndex] = updated;
  
  try {
    localStorage.setItem(USER_PRODUCTS_KEY, JSON.stringify(userProducts));
    return updated;
  } catch (error) {
    console.error('Ошибка при обновлении продукта:', error);
    return null;
  }
}



export function getAllProducts(): Product[] {
  const deletedSystemProducts = getDeletedSystemProducts();
  const userProducts = getUserProducts();
  
  // Создаем Map для быстрого поиска пользовательских продуктов по ID
  const userProductsMap = new Map(userProducts.map(p => [p.id, p]));
  
  // Фильтруем удаленные системные продукты и заменяем на пользовательские версии если есть
  const processedSystemProducts = PRODUCTS_DATA
    .filter(p => !deletedSystemProducts.includes(p.id))
    .map(p => userProductsMap.get(p.id) || p);
  
  // Добавляем только новые пользовательские продукты (те что не перезаписывают системные)
  const newUserProducts = userProducts.filter(p => isUserProduct(p.id));
  
  return [...processedSystemProducts, ...newUserProducts];
}

export function isUserProduct(productId: string): boolean {
  // Проверяем, является ли это системным продуктом из PRODUCTS_DATABASE
  const isSystemProduct = PRODUCTS_DATABASE.some(product => product.id === productId);
  return !isSystemProduct;
}

// Функции для работы с отчетами о миграции
export interface MigrationReportData {
  timestamp: string;
  report: string;
}

export function getMigrationReport(): MigrationReportData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem('migration_report');
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Ошибка при получении отчета о миграции:', error);
    return null;
  }
}

export function clearMigrationReport(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('migration_report');
  } catch (error) {
    console.error('Ошибка при очистке отчета о миграции:', error);
  }
}
