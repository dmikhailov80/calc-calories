'use client';

import { useState, useCallback } from 'react';
import { Product } from '@/lib/products-data';

export interface ConfirmModalState {
  isOpen: boolean;
  product: Product | null;
  originalProduct?: Product | null; // Для reset модалки
}

export interface UseConfirmModalReturn {
  deleteModal: ConfirmModalState;
  resetModal: ConfirmModalState;
  openDeleteModal: (product: Product) => void;
  openResetModal: (product: Product, originalProduct: Product) => void;
  closeDeleteModal: () => void;
  closeResetModal: () => void;
}

/**
 * Custom hook для управления модальными окнами подтверждения
 * Инкапсулирует логику управления состоянием модалок удаления и сброса
 */
export function useConfirmModal(): UseConfirmModalReturn {
  const [deleteModal, setDeleteModal] = useState<ConfirmModalState>({
    isOpen: false,
    product: null
  });

  const [resetModal, setResetModal] = useState<ConfirmModalState>({
    isOpen: false,
    product: null,
    originalProduct: null
  });

  // Открытие модалки удаления
  const openDeleteModal = useCallback((product: Product) => {
    setDeleteModal({
      isOpen: true,
      product
    });
  }, []);

  // Открытие модалки сброса
  const openResetModal = useCallback((product: Product, originalProduct: Product) => {
    setResetModal({
      isOpen: true,
      product,
      originalProduct
    });
  }, []);

  // Закрытие модалки удаления
  const closeDeleteModal = useCallback(() => {
    setDeleteModal({
      isOpen: false,
      product: null
    });
  }, []);

  // Закрытие модалки сброса
  const closeResetModal = useCallback(() => {
    setResetModal({
      isOpen: false,
      product: null,
      originalProduct: null
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
