'use client';

import { useState, useEffect, useCallback } from 'react';
import { getStorageItem, setStorageItem } from '@/lib/storage';

/**
 * Кастомный хук для состояния, которое синхронизируется с localStorage
 * Поддерживает SSR и работает безопасно на сервере
 */
export function usePersistedState<T>(
  key: string,
  defaultValue: T,
  options: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
  } = {}
): [T, (value: T | ((prev: T) => T)) => void] {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  } = options;

  // Инициализируем состояние с default значением (для SSR)
  const [state, setState] = useState<T>(defaultValue);
  const [isInitialized, setIsInitialized] = useState(false);

  // Загружаем состояние из localStorage при монтировании компонента
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      const stored = getStorageItem(key, defaultValue);
      setState(stored);
      setIsInitialized(true);
    }
  }, [key, defaultValue, isInitialized]);

  // Функция для обновления состояния
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState(prevState => {
        const newValue = typeof value === 'function' 
          ? (value as (prev: T) => T)(prevState) 
          : value;
        
        // Сохраняем в localStorage только если браузер поддерживает это
        if (typeof window !== 'undefined') {
          setStorageItem(key, newValue);
        }
        
        return newValue;
      });
    },
    [key]
  );

  return [state, setValue];
}
