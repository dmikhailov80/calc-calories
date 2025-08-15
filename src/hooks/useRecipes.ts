'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Recipe, 
  RecipeNutrition,
  getAllRecipes,
  getAllRecipesWithDeleted,
  getDeletedRecipes,
  saveUserRecipe, 
  updateUserRecipe, 
  deleteUserRecipe,
  resetSystemRecipe,
  restoreSystemRecipe,
  getRecipeById,
  getOriginalSystemRecipe,
  calculateRecipeNutrition
} from '@/lib/recipes-data';
import { usePersistedState } from './usePersistedState';
import { STORAGE_KEYS } from '@/lib/storage';

export interface UseRecipesReturn {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  showDeleted: boolean;
  setShowDeleted: (show: boolean) => void;
  addRecipe: (recipeData: Omit<Recipe, 'id'>) => Promise<Recipe | null>;
  updateRecipe: (recipeId: string, recipeData: Omit<Recipe, 'id'>) => Promise<Recipe | null>;
  deleteRecipe: (recipeId: string) => Promise<boolean>;
  resetRecipe: (recipeId: string) => Promise<boolean>;
  restoreRecipe: (recipeId: string) => Promise<boolean>;
  refreshRecipes: () => void;
  getRecipe: (recipeId: string) => Recipe | undefined;
  getOriginalRecipe: (recipeId: string) => Recipe | null;
  calculateNutrition: (recipe: Recipe) => RecipeNutrition;
}

/**
 * Custom hook для управления рецептами
 * Инкапсулирует всю логику CRUD операций с рецептами
 */
export function useRecipes(): UseRecipesReturn {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleted, setShowDeleted] = usePersistedState(STORAGE_KEYS.RECIPES_SHOW_DELETED, false);

  // Загрузка рецептов
  const loadRecipes = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      
      if (showDeleted) {
        // Показывать только удалённые рецепты
        const deletedRecipes = getDeletedRecipes();
        setRecipes(deletedRecipes);
      } else {
        // Показывать только активные рецепты (как было раньше)
        const activeRecipes = getAllRecipes();
        setRecipes(activeRecipes);
      }
    } catch (err) {
      setError('Ошибка при загрузке рецептов');
      console.error('Ошибка загрузки рецептов:', err);
    } finally {
      setLoading(false);
    }
  }, [showDeleted]);

  // Обновление списка рецептов
  const refreshRecipes = useCallback(() => {
    loadRecipes();
  }, [loadRecipes]);

  // Добавление нового рецепта
  const addRecipe = useCallback(async (recipeData: Omit<Recipe, 'id'>): Promise<Recipe | null> => {
    try {
      setError(null);
      const newRecipe = saveUserRecipe(recipeData);
      
      if (showDeleted) {
        // Показывать только удалённые рецепты
        const deletedRecipes = getDeletedRecipes();
        setRecipes(deletedRecipes);
      } else {
        // Показывать только активные рецепты
        const activeRecipes = getAllRecipes();
        setRecipes(activeRecipes);
      }
      
      return newRecipe;
    } catch (err) {
      const errorMessage = 'Произошла ошибка при добавлении рецепта';
      setError(errorMessage);
      console.error('Ошибка добавления рецепта:', err);
      return null;
    }
  }, [showDeleted]);

  // Обновление рецепта
  const updateRecipe = useCallback(async (
    recipeId: string, 
    recipeData: Omit<Recipe, 'id'>
  ): Promise<Recipe | null> => {
    try {
      setError(null);
      const updatedRecipe = updateUserRecipe(recipeId, recipeData);
      if (updatedRecipe) {
        if (showDeleted) {
          // Показывать только удалённые рецепты
          const allRecipesWithDeleted = getAllRecipesWithDeleted();
          const deletedOnly = allRecipesWithDeleted.filter(r => r.isDeleted);
          setRecipes(deletedOnly);
        } else {
          // Показывать только активные рецепты
          const activeRecipes = getAllRecipes();
          setRecipes(activeRecipes);
        }
        return updatedRecipe;
      } else {
        throw new Error('Не удалось обновить рецепт');
      }
    } catch (err) {
      const errorMessage = 'Произошла ошибка при обновлении рецепта';
      setError(errorMessage);
      console.error('Ошибка обновления рецепта:', err);
      return null;
    }
  }, [showDeleted]);

  // Удаление рецепта
  const deleteRecipe = useCallback(async (recipeId: string): Promise<boolean> => {
    try {
      setError(null);
      const success = deleteUserRecipe(recipeId);
      if (success) {
        if (showDeleted) {
          // Показывать только удалённые рецепты
          const allRecipesWithDeleted = getAllRecipesWithDeleted();
          const deletedOnly = allRecipesWithDeleted.filter(r => r.isDeleted);
          setRecipes(deletedOnly);
        } else {
          // Показывать только активные рецепты
          const activeRecipes = getAllRecipes();
          setRecipes(activeRecipes);
        }
        return true;
      } else {
        throw new Error('Не удалось удалить рецепт');
      }
    } catch (err) {
      const errorMessage = 'Произошла ошибка при удалении рецепта';
      setError(errorMessage);
      console.error('Ошибка удаления рецепта:', err);
      return false;
    }
  }, [showDeleted]);

  // Сброс системного рецепта
  const resetRecipe = useCallback(async (recipeId: string): Promise<boolean> => {
    try {
      setError(null);
      const success = resetSystemRecipe(recipeId);
      if (success) {
        if (showDeleted) {
          // Показывать только удалённые рецепты
          const allRecipesWithDeleted = getAllRecipesWithDeleted();
          const deletedOnly = allRecipesWithDeleted.filter(r => r.isDeleted);
          setRecipes(deletedOnly);
        } else {
          // Показывать только активные рецепты
          const activeRecipes = getAllRecipes();
          setRecipes(activeRecipes);
        }
        return true;
      } else {
        throw new Error('Не удалось сбросить рецепт');
      }
    } catch (err) {
      const errorMessage = 'Произошла ошибка при сбросе рецепта';
      setError(errorMessage);
      console.error('Ошибка сброса рецепта:', err);
      return false;
    }
  }, [showDeleted]);

  // Восстановление удалённого системного рецепта
  const restoreRecipe = useCallback(async (recipeId: string): Promise<boolean> => {
    try {
      setError(null);
      const success = restoreSystemRecipe(recipeId);
      if (success) {
        if (showDeleted) {
          // Показывать только удалённые рецепты (убираем восстановленный из списка)
          const deletedRecipes = getDeletedRecipes();
          setRecipes(deletedRecipes);
        } else {
          // Показывать только активные рецепты
          const activeRecipes = getAllRecipes();
          setRecipes(activeRecipes);
        }
        return true;
      } else {
        throw new Error('Не удалось восстановить рецепт');
      }
    } catch (err) {
      const errorMessage = 'Произошла ошибка при восстановлении рецепта';
      setError(errorMessage);
      console.error('Ошибка восстановления рецепта:', err);
      return false;
    }
  }, [showDeleted]);

  // Получение рецепта по ID
  const getRecipe = useCallback((recipeId: string): Recipe | undefined => {
    return getRecipeById(recipeId);
  }, []);

  // Получение оригинального системного рецепта
  const getOriginalRecipe = useCallback((recipeId: string): Recipe | null => {
    return getOriginalSystemRecipe(recipeId);
  }, []);

  // Расчёт пищевой ценности рецепта
  const calculateNutrition = useCallback((recipe: Recipe): RecipeNutrition => {
    return calculateRecipeNutrition(recipe);
  }, []);

  // Загрузка рецептов при монтировании
  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  return {
    recipes,
    loading,
    error,
    showDeleted,
    setShowDeleted,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    resetRecipe,
    restoreRecipe,
    refreshRecipes,
    getRecipe,
    getOriginalRecipe,
    calculateNutrition
  };
}
