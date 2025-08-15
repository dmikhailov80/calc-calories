'use client';

import { useState, useMemo, useCallback } from 'react';
import { Product, PRODUCT_CATEGORIES } from '@/lib/products-data';
import { usePersistedState } from './usePersistedState';
import { STORAGE_KEYS } from '@/lib/storage';
import type { ProductCategory } from '@/lib/ data/categories';

export interface ProductFilters {
  searchQuery: string;
  selectedCategory: string;
}

export interface UseProductFiltersReturn {
  filters: ProductFilters;
  filteredProducts: Product[];
  categories: ProductCategory[];
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (categoryKey: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

/**
 * Custom hook для фильтрации и поиска продуктов
 * Инкапсулирует логику фильтрации по категориям и поиску
 */
export function useProductFilters(products: Product[]): UseProductFiltersReturn {
  const [searchQuery, setSearchQuery] = usePersistedState(STORAGE_KEYS.PRODUCTS_SEARCH, '');
  const [selectedCategory, setSelectedCategory] = usePersistedState(STORAGE_KEYS.PRODUCTS_CATEGORY, 'all');

  // Получаем все категории как объекты - мемоизируем статический результат
  const categories = useMemo(() => Object.values(PRODUCT_CATEGORIES), []);

  // Мемоизируем нормализованный поисковый запрос
  const normalizedSearchQuery = useMemo(() => {
    return searchQuery.toLowerCase().trim();
  }, [searchQuery]);

  // Мемоизируем ключ категории (теперь selectedCategory уже содержит key)
  const categoryKey = useMemo(() => {
    return selectedCategory !== 'all' ? selectedCategory : null;
  }, [selectedCategory]);

  // Фильтрация продуктов с улучшенной производительностью
  const filteredProducts = useMemo(() => {
    if (!normalizedSearchQuery && !categoryKey) {
      return products; // Если нет фильтров, возвращаем оригинальный массив
    }

    return products.filter(product => {
      // Фильтрация по поисковому запросу
      if (normalizedSearchQuery && !product.name.toLowerCase().includes(normalizedSearchQuery)) {
        return false;
      }

      // Фильтрация по категории
      if (categoryKey && product.category !== categoryKey) {
        return false;
      }

      return true;
    });
  }, [products, normalizedSearchQuery, categoryKey]);

  // Проверка наличия активных фильтров - используем уже вычисленные значения
  const hasActiveFilters = useMemo(() => {
    return !!normalizedSearchQuery || !!categoryKey;
  }, [normalizedSearchQuery, categoryKey]);

  // Очистка всех фильтров
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
  }, []);

  // Сеттеры с дополнительной логикой
  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSetSelectedCategory = useCallback((categoryKey: string) => {
    setSelectedCategory(categoryKey);
  }, []);

  return {
    filters: {
      searchQuery,
      selectedCategory
    },
    filteredProducts,
    categories,
    setSearchQuery: handleSetSearchQuery,
    setSelectedCategory: handleSetSelectedCategory,
    clearFilters,
    hasActiveFilters
  };
}
