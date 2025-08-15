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

export function isUserRecipe(recipeId: string): boolean {
  // Проверяем, является ли это системным рецептом из RECIPES_DATABASE
  const isSystemRecipe = RECIPES_DATABASE.some(recipe => recipe.id === recipeId);
  return !isSystemRecipe;
}

export function isModifiedSystemRecipe(recipeId: string): boolean {
  // Проверяем, является ли это системным рецептом, который был изменен пользователем
  if (isUserRecipe(recipeId)) return false; // Это пользовательский рецепт, не системный
  
  const userRecipes = getUserRecipes();
  return userRecipes.some(r => r.id === recipeId);
}

export function getOriginalSystemRecipe(recipeId: string): Recipe | null {
  // Возвращает оригинальную версию системного рецепта
  const originalRecipe = RECIPES_DATABASE.find(recipe => recipe.id === recipeId);
  return originalRecipe || null;
}

export function updateUserRecipe(recipeId: string, recipeData: Omit<Recipe, 'id'>): Recipe | null {
  const userRecipes = getUserRecipes();
  
  // Если это системный рецепт, который еще не был изменен пользователем
  if (!isUserRecipe(recipeId) && !isModifiedSystemRecipe(recipeId)) {
    // Создаем пользовательскую копию системного рецепта
    const updatedRecipe: Recipe = {
      ...recipeData,
      id: recipeId
    };
    
    const updatedUserRecipes = [...userRecipes, updatedRecipe];
    
    try {
      localStorage.setItem(USER_RECIPES_KEY, JSON.stringify(updatedUserRecipes));
      return updatedRecipe;
    } catch (error) {
      console.error('Ошибка при создании пользовательской копии рецепта:', error);
      return null;
    }
  }
  
  // Обновляем существующий пользовательский рецепт
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
  // Если это системный рецепт, помечаем его как удаленный в deleted_system_recipes
  if (!isUserRecipe(recipeId)) {
    const deletedRecipes = getDeletedSystemRecipes();
    if (!deletedRecipes.includes(recipeId)) {
      deletedRecipes.push(recipeId);
      try {
        localStorage.setItem('deleted_system_recipes', JSON.stringify(deletedRecipes));
        return true;
      } catch (error) {
        console.error('Ошибка при удалении системного рецепта:', error);
        return false;
      }
    }
    return true;
  }

  // Если это пользовательский рецепт, удаляем его физически
  const userRecipes = getUserRecipes();
  const filteredRecipes = userRecipes.filter(r => r.id !== recipeId);
  
  try {
    localStorage.setItem(USER_RECIPES_KEY, JSON.stringify(filteredRecipes));
    return true;
  } catch (error) {
    console.error('Ошибка при удалении пользовательского рецепта:', error);
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
  const deletedSystemRecipes = getDeletedSystemRecipes();
  
  // Создаем Map для быстрого поиска пользовательских изменений
  const userRecipesMap = new Map<string, Recipe>();
  const newUserRecipes: Recipe[] = [];
  
  userRecipes.forEach(recipe => {
    const isSystemRecipe = systemRecipes.some(sr => sr.id === recipe.id);
    if (isSystemRecipe) {
      userRecipesMap.set(recipe.id, recipe);
    } else {
      // Это новый пользовательский рецепт
      newUserRecipes.push(recipe);
    }
  });
  
  // Обрабатываем системные рецепты
  const processedSystemRecipes = systemRecipes
    .filter(recipe => !deletedSystemRecipes.includes(recipe.id)) // Исключаем удаленные рецепты
    .map(systemRecipe => {
      const userModification = userRecipesMap.get(systemRecipe.id);
      return userModification || systemRecipe;
    });
  
  return [...processedSystemRecipes, ...newUserRecipes];
}

export function searchRecipes(query: string): Recipe[] {
  const lowercaseQuery = query.toLowerCase();
  const allRecipes = getAllRecipes();
  return allRecipes.filter(recipe => 
    recipe.name.toLowerCase().includes(lowercaseQuery) ||
    recipe.description?.toLowerCase().includes(lowercaseQuery)
  );
}

export function resetSystemRecipe(recipeId: string): boolean {
  // Сбрасываем изменения системного рецепта к оригинальному состоянию
  if (isUserRecipe(recipeId)) {
    console.error('Нельзя сбросить пользовательский рецепт');
    return false;
  }

  const userRecipes = getUserRecipes();
  const filteredRecipes = userRecipes.filter(r => r.id !== recipeId);
  
  try {
    localStorage.setItem(USER_RECIPES_KEY, JSON.stringify(filteredRecipes));
    return true;
  } catch (error) {
    console.error('Ошибка при сбросе системного рецепта:', error);
    return false;
  }
}

export function restoreSystemRecipe(recipeId: string): boolean {
  // Восстанавливаем удаленный системный рецепт
  if (isUserRecipe(recipeId)) {
    console.error('Нельзя восстановить пользовательский рецепт');
    return false;
  }

  const deletedRecipes = getDeletedSystemRecipes();
  const filteredDeleted = deletedRecipes.filter(id => id !== recipeId);
  
  try {
    localStorage.setItem('deleted_system_recipes', JSON.stringify(filteredDeleted));
    return true;
  } catch (error) {
    console.error('Ошибка при восстановлении системного рецепта:', error);
    return false;
  }
}

export function getAllRecipesWithDeleted(): Recipe[] {
  // Возвращает все рецепты, включая удаленные (для админ режима)
  const systemRecipes = getSystemRecipes();
  const userRecipes = getUserRecipes();
  const deletedSystemRecipes = getDeletedSystemRecipes();
  
  // Создаем Map для быстрого поиска пользовательских изменений
  const userRecipesMap = new Map<string, Recipe>();
  const newUserRecipes: Recipe[] = [];
  
  userRecipes.forEach(recipe => {
    const isSystemRecipe = systemRecipes.some(sr => sr.id === recipe.id);
    if (isSystemRecipe) {
      userRecipesMap.set(recipe.id, recipe);
    } else {
      // Это новый пользовательский рецепт
      newUserRecipes.push(recipe);
    }
  });
  
  // Обрабатываем системные рецепты - заменяем на пользовательские версии если есть, помечаем удалённые
  const processedSystemRecipes = systemRecipes.map(systemRecipe => {
    const userModification = userRecipesMap.get(systemRecipe.id);
    const isDeleted = deletedSystemRecipes.includes(systemRecipe.id);
    
    if (userModification) {
      return { ...userModification, isDeleted };
    }
    
    return { ...systemRecipe, isDeleted };
  });
  
  return [...processedSystemRecipes, ...newUserRecipes];
}

export function getDeletedSystemRecipes(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('deleted_system_recipes');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Ошибка при загрузке удаленных системных рецептов:', error);
    return [];
  }
}

// Получение удалённых системных рецептов как объектов
export function getDeletedRecipes(): Recipe[] {
  const deletedIds = getDeletedSystemRecipes();
  const systemRecipes = getSystemRecipes();
  return systemRecipes
    .filter(r => deletedIds.includes(r.id))
    .map(r => ({ ...r, isDeleted: true }));
}

// Подсчет количества удаленных системных рецептов
export function getDeletedRecipesCount(): number {
  return getDeletedSystemRecipes().length;
}

// Системные рецепты
function getSystemRecipes(): Recipe[] {
  return RECIPES_DATABASE;
}
