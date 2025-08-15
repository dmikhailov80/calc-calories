'use client';

import { useState, useCallback } from 'react';
import { Product } from '@/lib/products-data';

export interface ProductModalState {
  isOpen: boolean;
  mode: 'add' | 'edit';
  editingProduct?: Product;
}

export interface UseProductModalReturn {
  modalState: ProductModalState;
  openAddModal: () => void;
  openEditModal: (product: Product) => void;
  closeModal: () => void;
  isEditMode: boolean;
}

/**
 * Custom hook для управления состоянием модального окна продуктов
 * Инкапсулирует логику открытия/закрытия модалок в разных режимах
 */
export function useProductModal(): UseProductModalReturn {
  const [modalState, setModalState] = useState<ProductModalState>({
    isOpen: false,
    mode: 'add',
    editingProduct: undefined
  });

  // Открытие модалки в режиме добавления
  const openAddModal = useCallback(() => {
    setModalState({
      isOpen: true,
      mode: 'add',
      editingProduct: undefined
    });
  }, []);

  // Открытие модалки в режиме редактирования
  const openEditModal = useCallback((product: Product) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      editingProduct: product
    });
  }, []);

  // Закрытие модалки
  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      mode: 'add',
      editingProduct: undefined
    });
  }, []);

  // Вспомогательное свойство для проверки режима редактирования
  const isEditMode = modalState.mode === 'edit' && modalState.editingProduct !== undefined;

  return {
    modalState,
    openAddModal,
    openEditModal,
    closeModal,
    isEditMode
  };
}
