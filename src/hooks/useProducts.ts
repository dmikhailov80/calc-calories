'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Product, 
  getAllProducts, 
  saveUserProduct, 
  updateUserProduct, 
  deleteUserProduct, 
  resetSystemProduct,
  getOriginalSystemProduct 
} from '@/lib/products-data';

export interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (productData: Omit<Product, 'id'>) => Promise<Product | null>;
  updateProduct: (productId: string, productData: Omit<Product, 'id'>) => Promise<Product | null>;
  deleteProduct: (productId: string) => Promise<boolean>;
  resetProduct: (productId: string) => Promise<boolean>;
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

  // Загрузка продуктов
  const loadProducts = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      const allProducts = getAllProducts();
      setProducts(allProducts);
    } catch (err) {
      setError('Ошибка при загрузке продуктов');
      console.error('Ошибка загрузки продуктов:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Обновление списка продуктов
  const refreshProducts = useCallback(() => {
    loadProducts();
  }, [loadProducts]);

  // Добавление нового продукта
  const addProduct = useCallback(async (productData: Omit<Product, 'id'>): Promise<Product | null> => {
    try {
      setError(null);
      const newProduct = saveUserProduct(productData);
      setProducts(getAllProducts());
      return newProduct;
    } catch (err) {
      const errorMessage = 'Произошла ошибка при добавлении продукта';
      setError(errorMessage);
      console.error('Ошибка добавления продукта:', err);
      return null;
    }
  }, []);

  // Обновление продукта
  const updateProduct = useCallback(async (
    productId: string, 
    productData: Omit<Product, 'id'>
  ): Promise<Product | null> => {
    try {
      setError(null);
      const updatedProduct = updateUserProduct(productId, productData);
      if (updatedProduct) {
        setProducts(getAllProducts());
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
  }, []);

  // Удаление продукта
  const deleteProduct = useCallback(async (productId: string): Promise<boolean> => {
    try {
      setError(null);
      const success = deleteUserProduct(productId);
      if (success) {
        setProducts(getAllProducts());
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
  }, []);

  // Сброс системного продукта
  const resetProduct = useCallback(async (productId: string): Promise<boolean> => {
    try {
      setError(null);
      const success = resetSystemProduct(productId);
      if (success) {
        setProducts(getAllProducts());
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
  }, []);

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
    addProduct,
    updateProduct,
    deleteProduct,
    resetProduct,
    refreshProducts,
    getOriginalProduct
  };
}
