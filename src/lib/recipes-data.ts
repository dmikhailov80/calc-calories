import { MeasurementUnit, UnitType, MEASUREMENT_UNITS } from './units';
import { Product, getProductById } from './products-data';
import { RECIPES_DATABASE } from './ data/recipes';

// Интерфейс для ингредиента в рецепте
export interface RecipeIngredient {
  productId: string; // ссылка на продукт
  amount: number; // количество
  unit: MeasurementUnit; // единица измерения
}

// Интерфейс для рецепта
export interface Recipe {
  id: string; // UUID
  name: string; // название рецепта
  ingredients: RecipeIngredient[]; // список ингредиентов
  description?: string; // описание рецепта (опционально)
  isDeleted?: boolean; // флаг для удалённых рецептов (используется только в админ-режиме)
}

// Интерфейс для расчёта пищевой ценности рецепта
export interface RecipeNutrition {
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  totalWeight: number; // общий вес всех ингредиентов в граммах
}

// Функция для генерации UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Функция для расчёта пищевой ценности рецепта
export function calculateRecipeNutrition(recipe: Recipe): RecipeNutrition {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarbs = 0;
  let totalWeight = 0;

  recipe.ingredients.forEach(ingredient => {
    const product = getProductById(ingredient.productId);
    if (!product) return;

    // Переводим количество в граммы
    const weightInGrams = (ingredient.amount * ingredient.unit.weightInGrams) / 100;
    
    // Рассчитываем пищевую ценность для этого количества
    totalCalories += (product.calories * weightInGrams) / 100;
    totalProtein += (product.protein * weightInGrams) / 100;
    totalFat += (product.fat * weightInGrams) / 100;
    totalCarbs += (product.carbs * weightInGrams) / 100;
    totalWeight += weightInGrams;
  });

  return {
    totalCalories: Math.round(totalCalories * 100) / 100,
    totalProtein: Math.round(totalProtein * 100) / 100,
    totalFat: Math.round(totalFat * 100) / 100,
    totalCarbs: Math.round(totalCarbs * 100) / 100,
    totalWeight: Math.round(totalWeight)
  };
}

// Функции для работы с пользовательскими рецептами в localStorage
const USER_RECIPES_KEY = 'user_recipes';

export function getUserRecipes(): Recipe[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(USER_RECIPES_KEY);
    if (!stored) return [];
    
    const rawData = JSON.parse(stored);
    return rawData;
  } catch (error) {
    console.error('Ошибка при загрузке пользовательских рецептов:', error);
    return [];
  }
}

export function saveUserRecipe(recipe: Omit<Recipe, 'id'>): Recipe {
  const userRecipes = getUserRecipes();
  const newRecipe: Recipe = {
    ...recipe,
    id: generateUUID()
  };
  
  const updatedRecipes = [...userRecipes, newRecipe];
  
  try {
    localStorage.setItem(USER_RECIPES_KEY, JSON.stringify(updatedRecipes));
    return newRecipe;
  } catch (error) {
    console.error('Ошибка при сохранении рецепта:', error);
    throw new Error('Не удалось сохранить рецепт');
  }
}

export function updateUserRecipe(recipeId: string, recipeData: Omit<Recipe, 'id'>): Recipe | null {
  const userRecipes = getUserRecipes();
  const recipeIndex = userRecipes.findIndex(r => r.id === recipeId);
  
  if (recipeIndex === -1) return null;
  
  const updatedRecipe: Recipe = {
    ...recipeData,
    id: recipeId
  };
  
  userRecipes[recipeIndex] = updatedRecipe;
  
  try {
    localStorage.setItem(USER_RECIPES_KEY, JSON.stringify(userRecipes));
    return updatedRecipe;
  } catch (error) {
    console.error('Ошибка при обновлении рецепта:', error);
    return null;
  }
}

export function deleteUserRecipe(recipeId: string): boolean {
  const userRecipes = getUserRecipes();
  const filteredRecipes = userRecipes.filter(r => r.id !== recipeId);
  
  try {
    localStorage.setItem(USER_RECIPES_KEY, JSON.stringify(filteredRecipes));
    return true;
  } catch (error) {
    console.error('Ошибка при удалении рецепта:', error);
    return false;
  }
}

export function getRecipeById(id: string): Recipe | undefined {
  const allRecipes = getAllRecipes();
  return allRecipes.find(recipe => recipe.id === id);
}

export function getAllRecipes(): Recipe[] {
  const systemRecipes = getSystemRecipes();
  const userRecipes = getUserRecipes();
  
  return [...systemRecipes, ...userRecipes];
}

export function searchRecipes(query: string): Recipe[] {
  const lowercaseQuery = query.toLowerCase();
  const allRecipes = getAllRecipes();
  return allRecipes.filter(recipe => 
    recipe.name.toLowerCase().includes(lowercaseQuery) ||
    recipe.description?.toLowerCase().includes(lowercaseQuery)
  );
}

// Системные рецепты
function getSystemRecipes(): Recipe[] {
  return RECIPES_DATABASE;
}
