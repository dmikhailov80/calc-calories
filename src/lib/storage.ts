'use client';

/**
 * Утилиты для работы с localStorage с поддержкой SSR
 */

// Проверяем доступность localStorage (работает только в браузере)
const isLocalStorageAvailable = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Сохраняет значение в localStorage
 */
export const setStorageItem = <T>(key: string, value: T): void => {
  if (!isLocalStorageAvailable()) {
    return;
  }
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Не удалось сохранить в localStorage ключ ${key}:`, error);
  }
};

/**
 * Получает значение из localStorage
 */
export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  if (!isLocalStorageAvailable()) {
    return defaultValue;
  }
  
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`Не удалось получить из localStorage ключ ${key}:`, error);
    return defaultValue;
  }
};

/**
 * Удаляет значение из localStorage
 */
export const removeStorageItem = (key: string): void => {
  if (!isLocalStorageAvailable()) {
    return;
  }
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Не удалось удалить из localStorage ключ ${key}:`, error);
  }
};

// Константы для ключей localStorage
export const STORAGE_KEYS = {
  // Состояние продуктов
  PRODUCTS_SEARCH: 'calc-calories:products:search',
  PRODUCTS_CATEGORY: 'calc-calories:products:category',
  PRODUCTS_SHOW_DELETED: 'calc-calories:products:showDeleted',
  
  // Состояние рецептов
  RECIPES_SEARCH: 'calc-calories:recipes:search',
  RECIPES_SHOW_DELETED: 'calc-calories:recipes:showDeleted',
} as const;

// Типы для состояний
export interface ProductsState {
  searchQuery: string;
  selectedCategory: string;
  showDeleted: boolean;
}

export interface RecipesState {
  searchQuery: string;
  showDeleted: boolean;
}

/**
 * Сохранение состояния продуктов
 */
export const saveProductsState = (state: Partial<ProductsState>): void => {
  if (state.searchQuery !== undefined) {
    setStorageItem(STORAGE_KEYS.PRODUCTS_SEARCH, state.searchQuery);
  }
  if (state.selectedCategory !== undefined) {
    setStorageItem(STORAGE_KEYS.PRODUCTS_CATEGORY, state.selectedCategory);
  }
  if (state.showDeleted !== undefined) {
    setStorageItem(STORAGE_KEYS.PRODUCTS_SHOW_DELETED, state.showDeleted);
  }
};

/**
 * Загрузка состояния продуктов
 */
export const loadProductsState = (): ProductsState => {
  return {
    searchQuery: getStorageItem(STORAGE_KEYS.PRODUCTS_SEARCH, ''),
    selectedCategory: getStorageItem(STORAGE_KEYS.PRODUCTS_CATEGORY, 'all'),
    showDeleted: getStorageItem(STORAGE_KEYS.PRODUCTS_SHOW_DELETED, false),
  };
};

/**
 * Сохранение состояния рецептов
 */
export const saveRecipesState = (state: Partial<RecipesState>): void => {
  if (state.searchQuery !== undefined) {
    setStorageItem(STORAGE_KEYS.RECIPES_SEARCH, state.searchQuery);
  }
  if (state.showDeleted !== undefined) {
    setStorageItem(STORAGE_KEYS.RECIPES_SHOW_DELETED, state.showDeleted);
  }
};

/**
 * Загрузка состояния рецептов
 */
export const loadRecipesState = (): RecipesState => {
  return {
    searchQuery: getStorageItem(STORAGE_KEYS.RECIPES_SEARCH, ''),
    showDeleted: getStorageItem(STORAGE_KEYS.RECIPES_SHOW_DELETED, false),
  };
};
