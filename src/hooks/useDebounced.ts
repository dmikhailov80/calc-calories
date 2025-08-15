'use client';

import { useState, useEffect, useMemo } from 'react';

/**
 * Хук для дебаунсинга значений
 * Помогает оптимизировать производительность при частых изменениях
 */
export function useDebounced<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Хук для дебаунсинга с возможностью принудительного обновления
 */
export function useDebouncedWithForce<T>(value: T, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isDebouncing, setIsDebouncing] = useState(false);

  useEffect(() => {
    setIsDebouncing(true);
    
    const timer = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  const forceUpdate = useMemo(() => () => {
    setDebouncedValue(value);
    setIsDebouncing(false);
  }, [value]);

  return {
    debouncedValue,
    isDebouncing,
    forceUpdate
  };
}

/**
 * Хук для оптимизации поисковых запросов с дебаунсингом
 */
export function useDebouncedSearch(searchQuery: string, delay: number = 300) {
  const debouncedQuery = useDebounced(searchQuery, delay);
  
  // Нормализуем запрос только после дебаунсинга
  const normalizedQuery = useMemo(() => {
    return debouncedQuery.toLowerCase().trim();
  }, [debouncedQuery]);

  const isSearching = useMemo(() => {
    return searchQuery !== debouncedQuery && searchQuery.trim() !== '';
  }, [searchQuery, debouncedQuery]);

  return {
    debouncedQuery,
    normalizedQuery,
    isSearching
  };
}
