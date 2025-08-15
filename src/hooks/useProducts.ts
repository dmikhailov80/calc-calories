'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Product, 
  getAllProducts, 
  getAllProductsWithDeleted,
  saveUserProduct, 
  updateUserProduct, 
  deleteUserProduct, 
  resetSystemProduct,
  restoreSystemProduct,
  getOriginalSystemProduct 
} from '@/lib/products-data';
import { usePersistedState } from './usePersistedState';
import { STORAGE_KEYS } from '@/lib/storage';

export interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  showDeleted: boolean;
  setShowDeleted: (show: boolean) => void;
  addProduct: (productData: Omit<Product, 'id'>) => Promise<Product | null>;
  updateProduct: (productId: string, productData: Omit<Product, 'id'>) => Promise<Product | null>;
  deleteProduct: (productId: string) => Promise<boolean>;
  resetProduct: (productId: string) => Promise<boolean>;
  restoreProduct: (productId: string) => Promise<boolean>;
  refreshProducts: () => void;
  getOriginalProduct: (productId: string) => Product | null;
}

/**
 * Custom hook для управления продуктами
 * Инкапсулирует всю логику CRUD операций с продуктами
 */
export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleted, setShowDeleted] = usePersistedState(STORAGE_KEYS.PRODUCTS_SHOW_DELETED, false);

  // Загрузка продуктов
  const loadProducts = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      
      if (showDeleted) {
        // Показывать только удалённые продукты
        const allProductsWithDeleted = getAllProductsWithDeleted();
        const deletedOnly = allProductsWithDeleted.filter(p => p.isDeleted);
        setProducts(deletedOnly);
      } else {
        // Показывать только активные продукты (как было раньше)
        const activeProducts = getAllProducts();
        setProducts(activeProducts);
      }
    } catch (err) {
      setError('Ошибка при загрузке продуктов');
      console.error('Ошибка загрузки продуктов:', err);
    } finally {
      setLoading(false);
    }
  }, [showDeleted]);

  // Обновление списка продуктов
  const refreshProducts = useCallback(() => {
    loadProducts();
  }, [loadProducts]);

  // Добавление нового продукта
  const addProduct = useCallback(async (productData: Omit<Product, 'id'>): Promise<Product | null> => {
    try {
      setError(null);
      const newProduct = saveUserProduct(productData);
      
      if (showDeleted) {
        // Показывать только удалённые продукты
        const allProductsWithDeleted = getAllProductsWithDeleted();
        const deletedOnly = allProductsWithDeleted.filter(p => p.isDeleted);
        setProducts(deletedOnly);
      } else {
        // Показывать только активные продукты
        const activeProducts = getAllProducts();
        setProducts(activeProducts);
      }
      
      return newProduct;
    } catch (err) {
      const errorMessage = 'Произошла ошибка при добавлении продукта';
      setError(errorMessage);
      console.error('Ошибка добавления продукта:', err);
      return null;
    }
  }, [showDeleted]);

  // Обновление продукта
  const updateProduct = useCallback(async (
    productId: string, 
    productData: Omit<Product, 'id'>
  ): Promise<Product | null> => {
    try {
      setError(null);
      const updatedProduct = updateUserProduct(productId, productData);
      if (updatedProduct) {
        if (showDeleted) {
          // Показывать только удалённые продукты
          const allProductsWithDeleted = getAllProductsWithDeleted();
          const deletedOnly = allProductsWithDeleted.filter(p => p.isDeleted);
          setProducts(deletedOnly);
        } else {
          // Показывать только активные продукты
          const activeProducts = getAllProducts();
          setProducts(activeProducts);
        }
        return updatedProduct;
      } else {
        throw new Error('Не удалось обновить продукт');
      }
    } catch (err) {
      const errorMessage = 'Произошла ошибка при обновлении продукта';
      setError(errorMessage);
      console.error('Ошибка обновления продукта:', err);
      return null;
    }
  }, [showDeleted]);

  // Удаление продукта
  const deleteProduct = useCallback(async (productId: string): Promise<boolean> => {
    try {
      setError(null);
      const success = deleteUserProduct(productId);
      if (success) {
        if (showDeleted) {
          // Показывать только удалённые продукты
          const allProductsWithDeleted = getAllProductsWithDeleted();
          const deletedOnly = allProductsWithDeleted.filter(p => p.isDeleted);
          setProducts(deletedOnly);
        } else {
          // Показывать только активные продукты
          const activeProducts = getAllProducts();
          setProducts(activeProducts);
        }
        return true;
      } else {
        throw new Error('Не удалось удалить продукт');
      }
    } catch (err) {
      const errorMessage = 'Произошла ошибка при удалении продукта';
      setError(errorMessage);
      console.error('Ошибка удаления продукта:', err);
      return false;
    }
  }, [showDeleted]);

  // Сброс системного продукта
  const resetProduct = useCallback(async (productId: string): Promise<boolean> => {
    try {
      setError(null);
      const success = resetSystemProduct(productId);
      if (success) {
        if (showDeleted) {
          // Показывать только удалённые продукты
          const allProductsWithDeleted = getAllProductsWithDeleted();
          const deletedOnly = allProductsWithDeleted.filter(p => p.isDeleted);
          setProducts(deletedOnly);
        } else {
          // Показывать только активные продукты
          const activeProducts = getAllProducts();
          setProducts(activeProducts);
        }
        return true;
      } else {
        throw new Error('Не удалось сбросить продукт');
      }
    } catch (err) {
      const errorMessage = 'Произошла ошибка при сбросе продукта';
      setError(errorMessage);
      console.error('Ошибка сброса продукта:', err);
      return false;
    }
  }, [showDeleted]);

  // Восстановление удалённого системного продукта
  const restoreProduct = useCallback(async (productId: string): Promise<boolean> => {
    try {
      setError(null);
      const success = restoreSystemProduct(productId);
      if (success) {
        if (showDeleted) {
          // Показывать только удалённые продукты (убираем восстановленный из списка)
          const allProductsWithDeleted = getAllProductsWithDeleted();
          const deletedOnly = allProductsWithDeleted.filter(p => p.isDeleted);
          setProducts(deletedOnly);
        } else {
          // Показывать только активные продукты
          const activeProducts = getAllProducts();
          setProducts(activeProducts);
        }
        return true;
      } else {
        throw new Error('Не удалось восстановить продукт');
      }
    } catch (err) {
      const errorMessage = 'Произошла ошибка при восстановлении продукта';
      setError(errorMessage);
      console.error('Ошибка восстановления продукта:', err);
      return false;
    }
  }, [showDeleted]);

  // Получение оригинального системного продукта
  const getOriginalProduct = useCallback((productId: string): Product | null => {
    return getOriginalSystemProduct(productId);
  }, []);

  // Загрузка продуктов при монтировании
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    loading,
    error,
    showDeleted,
    setShowDeleted,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProduct,
    restoreProduct,
    refreshProducts,
    getOriginalProduct
  };
}
