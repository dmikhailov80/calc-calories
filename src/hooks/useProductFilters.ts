'use client';

import { useState, useMemo, useCallback } from 'react';
import { Product, getAllCategories, getCategoryKey } from '@/lib/products-data';

export interface ProductFilters {
  searchQuery: string;
  selectedCategory: string;
}

export interface UseProductFiltersReturn {
  filters: ProductFilters;
  filteredProducts: Product[];
  categories: string[];
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

/**
 * Custom hook для фильтрации и поиска продуктов
 * Инкапсулирует логику фильтрации по категориям и поиску
 */
export function useProductFilters(products: Product[]): UseProductFiltersReturn {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Получаем все категории
  const categories = useMemo(() => getAllCategories(), []);

  // Фильтрация продуктов
  const filteredProducts = useMemo(() => {
    let result = products;

    // Фильтрация по поисковому запросу
    if (searchQuery.trim()) {
      const lowercaseQuery = searchQuery.toLowerCase().trim();
      result = result.filter(product => 
        product.name.toLowerCase().includes(lowercaseQuery)
      );
    }

    // Фильтрация по категории
    if (selectedCategory !== 'all') {
      const categoryKey = getCategoryKey(selectedCategory);
      result = result.filter(product => product.category === categoryKey);
    }

    return result;
  }, [products, searchQuery, selectedCategory]);

  // Проверка наличия активных фильтров
  const hasActiveFilters = useMemo(() => {
    return searchQuery.trim() !== '' || selectedCategory !== 'all';
  }, [searchQuery, selectedCategory]);

  // Очистка всех фильтров
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
  }, []);

  // Сеттеры с дополнительной логикой
  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSetSelectedCategory = useCallback((category: string) => {
    setSelectedCategory(category);
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
