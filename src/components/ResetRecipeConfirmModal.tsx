'use client';

import { useEffect } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Recipe, RecipeIngredient } from '@/lib/recipes-data';
import { getProductById } from '@/lib/products-data';

interface ResetRecipeConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recipe: Recipe | null;
  originalRecipe: Recipe | null;
}

export default function ResetRecipeConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  recipe, 
  originalRecipe 
}: ResetRecipeConfirmModalProps) {
  // Функция для получения добавленных ингредиентов
  const getAddedIngredients = (): RecipeIngredient[] => {
    if (!recipe?.ingredients || !originalRecipe?.ingredients) return [];
    
    // Получаем измененные ингредиенты для исключения
    const modifiedIngredients = getModifiedIngredients();
    const modifiedProductIds = new Set(modifiedIngredients.map(m => m.current.productId));
    
    return recipe.ingredients.filter(currentIngredient => 
      !modifiedProductIds.has(currentIngredient.productId) && // Исключаем измененные
      !originalRecipe.ingredients.some(originalIngredient => 
        originalIngredient.productId === currentIngredient.productId
      )
    );
  };

  // Функция для получения удаленных ингредиентов
  const getRemovedIngredients = (): RecipeIngredient[] => {
    if (!recipe?.ingredients || !originalRecipe?.ingredients) return [];
    
    // Получаем измененные ингредиенты для исключения
    const modifiedIngredients = getModifiedIngredients();
    const modifiedProductIds = new Set(modifiedIngredients.map(m => m.original.productId));
    
    return originalRecipe.ingredients.filter(originalIngredient => 
      !modifiedProductIds.has(originalIngredient.productId) && // Исключаем измененные
      !recipe.ingredients.some(currentIngredient => 
        currentIngredient.productId === originalIngredient.productId
      )
    );
  };

  // Функция для получения измененных ингредиентов
  const getModifiedIngredients = (): { current: RecipeIngredient; original: RecipeIngredient }[] => {
    if (!recipe?.ingredients || !originalRecipe?.ingredients) return [];
    
    const modified: { current: RecipeIngredient; original: RecipeIngredient }[] = [];
    
    // Находим ингредиенты, которые есть в обоих рецептах (по productId)
    const commonProductIds = new Set(
      recipe.ingredients.map(i => i.productId).filter(id => 
        originalRecipe.ingredients.some(oi => oi.productId === id)
      )
    );
    
    commonProductIds.forEach(productId => {
      const currentIngredient = recipe.ingredients.find(i => i.productId === productId);
      const originalIngredient = originalRecipe.ingredients.find(i => i.productId === productId);
      
      if (currentIngredient && originalIngredient && (
        currentIngredient.amount !== originalIngredient.amount ||
        currentIngredient.unit.displayName !== originalIngredient.unit.displayName
      )) {
        modified.push({ current: currentIngredient, original: originalIngredient });
      }
    });
    
    return modified;
  };

  // Функция для проверки изменений в ингредиентах
  const ingredientsChanged = () => {
    if (!recipe?.ingredients || !originalRecipe?.ingredients) {
      return (recipe?.ingredients?.length || 0) !== (originalRecipe?.ingredients?.length || 0);
    }
    
    const added = getAddedIngredients();
    const removed = getRemovedIngredients();
    const modified = getModifiedIngredients();
    
    return added.length > 0 || removed.length > 0 || modified.length > 0;
  };

  // Обработка нажатия клавиши Esc
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      return () => {
        document.removeEventListener('keydown', handleEscapeKey);
      };
    }
  }, [isOpen, onClose]);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (!isOpen || !recipe || !originalRecipe) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center min-[420px]:p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-background min-[420px]:rounded-lg border shadow-lg w-full min-[420px]:max-w-md h-full min-[420px]:h-auto min-[420px]:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between p-4 min-[420px]:p-6 border-b">
          <div className="flex items-center space-x-3">
            <RotateCcw className="h-6 w-6 text-orange-500" />
            <h2 className="text-xl font-semibold text-foreground">Сброс изменений</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-secondary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Содержимое */}
        <div className="p-4 min-[420px]:p-6 space-y-4">
          {/* Предупреждение */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm font-medium text-orange-800 mb-2">
              Вы действительно хотите сбросить изменения рецепта?
            </p>
            <p className="text-sm text-orange-700">
              Это действие нельзя отменить. Все пользовательские изменения будут потеряны.
            </p>
          </div>

          {/* Информация о рецепте */}
          <div className="bg-secondary/50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3">
              {recipe.name !== originalRecipe.name ? (
                <span>
                  <span className="text-red-600">{recipe.name}</span>
                  <span className="text-muted-foreground mx-2">→</span>
                  <span className="text-green-600">{originalRecipe.name}</span>
                </span>
              ) : (
                recipe.name
              )}
            </h3>
            
            {/* Сравнение значений */}
            <div className="space-y-2">
              {/* Заголовок таблицы только если есть изменения */}
              {(recipe.name !== originalRecipe.name || 
                recipe.description !== originalRecipe.description ||
                ingredientsChanged()) && (
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="font-medium text-muted-foreground">Показатель</div>
                  <div className="font-medium text-red-600">Текущее</div>
                  <div className="font-medium text-green-600">Будет восстановлено</div>
                </div>
              )}
              
              {/* Название, если изменено */}
              {recipe.name !== originalRecipe.name && (
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>Название:</div>
                  <div className="text-red-600">{recipe.name}</div>
                  <div className="text-green-600">{originalRecipe.name}</div>
                </div>
              )}
              
              {/* Описание, если изменено */}
              {recipe.description !== originalRecipe.description && (
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>Описание:</div>
                  <div className="text-red-600">{recipe.description || 'отсутствует'}</div>
                  <div className="text-green-600">{originalRecipe.description || 'отсутствует'}</div>
                </div>
              )}

              {/* Ингредиенты, если изменены */}
              {ingredientsChanged() && (
                <div className="border-t pt-2 mt-2">
                  <div className="font-medium text-muted-foreground mb-2 text-sm">Ингредиенты:</div>
                  
                  {/* Добавленные ингредиенты */}
                  {getAddedIngredients().map((ingredient, index) => {
                    const product = getProductById(ingredient.productId);
                    return (
                      <div key={`added-${index}`} className="grid grid-cols-3 gap-2 text-sm py-1">
                        <div className="text-muted-foreground">Добавлено:</div>
                        <div className="text-green-600">
                          {product?.name || 'Неизвестный продукт'} - {ingredient.amount} {ingredient.unit.displayName}
                        </div>
                        <div className="text-red-600">будет удалено</div>
                      </div>
                    );
                  })}
                  
                  {/* Удаленные ингредиенты */}
                  {getRemovedIngredients().map((ingredient, index) => {
                    const product = getProductById(ingredient.productId);
                    return (
                      <div key={`removed-${index}`} className="grid grid-cols-3 gap-2 text-sm py-1">
                        <div className="text-muted-foreground">Удалено:</div>
                        <div className="text-red-600">отсутствует</div>
                        <div className="text-green-600">
                          {product?.name || 'Неизвестный продукт'} - {ingredient.amount} {ingredient.unit.displayName}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Измененные ингредиенты */}
                  {getModifiedIngredients().map((ingredientPair, index) => {
                    const product = getProductById(ingredientPair.current.productId);
                    return (
                      <div key={`modified-${index}`} className="grid grid-cols-3 gap-2 text-sm py-1">
                        <div className="text-muted-foreground">Изменено:</div>
                        <div className="text-red-600">
                          {product?.name || 'Неизвестный продукт'} - {ingredientPair.current.amount} {ingredientPair.current.unit.displayName}
                        </div>
                        <div className="text-green-600">
                          {product?.name || 'Неизвестный продукт'} - {ingredientPair.original.amount} {ingredientPair.original.unit.displayName}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Сообщение если ничего не изменилось */}
              {!(recipe.name !== originalRecipe.name || 
                recipe.description !== originalRecipe.description ||
                ingredientsChanged()) && (
                <div className="text-center text-muted-foreground text-sm py-2">
                  Нет изменений для сброса
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex space-x-3 p-4 min-[420px]:p-6 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Отмена
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
          >
            Сбросить изменения
          </Button>
        </div>
      </div>
    </div>
  );
}
