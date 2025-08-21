'use client';

import { useState, useCallback } from 'react';
import { Product } from '@/lib/products-data';
import { Recipe } from '@/lib/recipes-data';

export interface ConfirmModalState<T = Product | Recipe> {
  isOpen: boolean;
  item: T | null;
  originalItem?: T | null; // Для reset модалки
}

export interface UseConfirmModalReturn {
  deleteModal: ConfirmModalState;
  resetModal: ConfirmModalState;
  openDeleteModal: <T extends Product | Recipe>(item: T) => void;
  openResetModal: <T extends Product | Recipe>(item: T, originalItem: T) => void;
  closeDeleteModal: () => void;
  closeResetModal: () => void;
}

/**
 * Custom hook для управления модальными окнами подтверждения
 * Инкапсулирует логику управления состоянием модалок удаления и сброса
 * Поддерживает как продукты, так и рецепты
 */
export function useConfirmModal(): UseConfirmModalReturn {
  const [deleteModal, setDeleteModal] = useState<ConfirmModalState<Product | Recipe>>({
    isOpen: false,
    item: null
  });

  const [resetModal, setResetModal] = useState<ConfirmModalState<Product | Recipe>>({
    isOpen: false,
    item: null,
    originalItem: null
  });

  // Открытие модалки удаления
  const openDeleteModal = useCallback(<T extends Product | Recipe>(item: T) => {
    setDeleteModal({
      isOpen: true,
      item
    });
  }, []);

  // Открытие модалки сброса
  const openResetModal = useCallback(<T extends Product | Recipe>(item: T, originalItem: T) => {
    setResetModal({
      isOpen: true,
      item,
      originalItem
    });
  }, []);

  // Закрытие модалки удаления
  const closeDeleteModal = useCallback(() => {
    setDeleteModal({
      isOpen: false,
      item: null
    });
  }, []);

  // Закрытие модалки сброса
  const closeResetModal = useCallback(() => {
    setResetModal({
      isOpen: false,
      item: null,
      originalItem: null
    });
  }, []);

  return {
    deleteModal,
    resetModal,
    openDeleteModal,
    openResetModal,
    closeDeleteModal,
    closeResetModal
  };
}
