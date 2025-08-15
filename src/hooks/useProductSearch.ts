'use client';

import { useMemo } from 'react';
import { Product } from '@/lib/products-data';

// Кэш для поисковых запросов
const searchCache = new Map<string, Product[]>();
const CACHE_SIZE_LIMIT = 50; // Ограничиваем размер кэша

/**
 * Оптимизированный хук для поиска продуктов с кэшированием
 */
export function useProductSearch(products: Product[], query: string) {
  return useMemo(() => {
    if (!query.trim()) {
      return products;
    }

    const normalizedQuery = query.toLowerCase().trim();
    const cacheKey = `${normalizedQuery}-${products.length}`;

    // Проверяем кэш
    if (searchCache.has(cacheKey)) {
      return searchCache.get(cacheKey)!;
    }

    // Выполняем поиск
    const results = products.filter(product => 
      product.name.toLowerCase().includes(normalizedQuery)
    );

    // Сохраняем в кэш с ограничением размера
    if (searchCache.size >= CACHE_SIZE_LIMIT) {
      // Удаляем самую старую запись
      const firstKey = searchCache.keys().next().value;
      searchCache.delete(firstKey);
    }
    searchCache.set(cacheKey, results);

    return results;
  }, [products, query]);
}

/**
 * Очистка кэша поиска (например, при изменении списка продуктов)
 */
export function clearSearchCache() {
  searchCache.clear();
}
