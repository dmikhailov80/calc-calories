'use client';

import { useState, useCallback } from 'react';
import { Recipe } from '@/lib/recipes-data';

export interface RecipeModalState {
  isOpen: boolean;
  mode: 'add' | 'edit';
  editingRecipe?: Recipe;
}

export interface UseRecipeModalReturn {
  modalState: RecipeModalState;
  openAddModal: () => void;
  openEditModal: (recipe: Recipe) => void;
  closeModal: () => void;
  isEditMode: boolean;
}

/**
 * Custom hook для управления состоянием модального окна рецептов
 * Инкапсулирует логику открытия/закрытия модалок в разных режимах
 */
export function useRecipeModal(): UseRecipeModalReturn {
  const [modalState, setModalState] = useState<RecipeModalState>({
    isOpen: false,
    mode: 'add',
    editingRecipe: undefined
  });

  // Открытие модалки в режиме добавления
  const openAddModal = useCallback(() => {
    setModalState({
      isOpen: true,
      mode: 'add',
      editingRecipe: undefined
    });
  }, []);

  // Открытие модалки в режиме редактирования
  const openEditModal = useCallback((recipe: Recipe) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      editingRecipe: recipe
    });
  }, []);

  // Закрытие модалки
  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      mode: 'add',
      editingRecipe: undefined
    });
  }, []);

  // Вспомогательное свойство для проверки режима редактирования
  const isEditMode = modalState.mode === 'edit' && modalState.editingRecipe !== undefined;

  return {
    modalState,
    openAddModal,
    openEditModal,
    closeModal,
    isEditMode
  };
}
