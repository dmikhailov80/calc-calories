'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Recipe, 
  RecipeNutrition,
  getAllRecipes, 
  saveUserRecipe, 
  updateUserRecipe, 
  deleteUserRecipe, 
  getRecipeById,
  calculateRecipeNutrition
} from '@/lib/recipes-data';

export interface UseRecipesReturn {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  addRecipe: (recipeData: Omit<Recipe, 'id'>) => Promise<Recipe | null>;
  updateRecipe: (recipeId: string, recipeData: Omit<Recipe, 'id'>) => Promise<Recipe | null>;
  deleteRecipe: (recipeId: string) => Promise<boolean>;
  refreshRecipes: () => void;
  getRecipe: (recipeId: string) => Recipe | undefined;
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

  // Загрузка рецептов
  const loadRecipes = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      
      const allRecipes = getAllRecipes();
      setRecipes(allRecipes);
    } catch (err) {
      setError('Ошибка при загрузке рецептов');
      console.error('Ошибка загрузки рецептов:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Обновление списка рецептов
  const refreshRecipes = useCallback(() => {
    loadRecipes();
  }, [loadRecipes]);

  // Добавление нового рецепта
  const addRecipe = useCallback(async (recipeData: Omit<Recipe, 'id'>): Promise<Recipe | null> => {
    try {
      setError(null);
      const newRecipe = saveUserRecipe(recipeData);
      
      const allRecipes = getAllRecipes();
      setRecipes(allRecipes);
      
      return newRecipe;
    } catch (err) {
      const errorMessage = 'Произошла ошибка при добавлении рецепта';
      setError(errorMessage);
      console.error('Ошибка добавления рецепта:', err);
      return null;
    }
  }, []);

  // Обновление рецепта
  const updateRecipe = useCallback(async (
    recipeId: string, 
    recipeData: Omit<Recipe, 'id'>
  ): Promise<Recipe | null> => {
    try {
      setError(null);
      const updatedRecipe = updateUserRecipe(recipeId, recipeData);
      if (updatedRecipe) {
        const allRecipes = getAllRecipes();
        setRecipes(allRecipes);
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
  }, []);

  // Удаление рецепта
  const deleteRecipe = useCallback(async (recipeId: string): Promise<boolean> => {
    try {
      setError(null);
      const success = deleteUserRecipe(recipeId);
      if (success) {
        const allRecipes = getAllRecipes();
        setRecipes(allRecipes);
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
  }, []);

  // Получение рецепта по ID
  const getRecipe = useCallback((recipeId: string): Recipe | undefined => {
    return getRecipeById(recipeId);
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
    addRecipe,
    updateRecipe,
    deleteRecipe,
    refreshRecipes,
    getRecipe,
    calculateNutrition
  };
}
