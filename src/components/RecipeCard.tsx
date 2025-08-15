'use client';

import { memo, useCallback } from 'react';
import { Edit, Trash2, RotateCcw, Undo2, ChefHat, Utensils } from 'lucide-react';
import { Recipe, RecipeNutrition, isUserRecipe, isModifiedSystemRecipe } from '@/lib/recipes-data';
import { getProductById } from '@/lib/products-data';
import { Button } from '@/components/ui/button';

interface RecipeCardProps {
  recipe: Recipe;
  nutrition: RecipeNutrition;
  isExpanded?: boolean;
  onCardClick?: (recipeId: string) => void;
  onClick?: () => void;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (recipeId: string) => void;
  onReset?: (recipeId: string) => void;
  onRestore?: (recipeId: string) => void;
  className?: string;
}

function RecipeCard({ recipe, nutrition, isExpanded = false, onCardClick, onClick, onEdit, onDelete, onReset, onRestore, className = '' }: RecipeCardProps) {
  const handleCardClick = useCallback(() => {
    onCardClick?.(recipe.id);
  }, [onCardClick, recipe.id]);

  const handleViewClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(recipe);
  }, [onEdit, recipe]);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(recipe.id);
  }, [onDelete, recipe.id]);

  const handleResetClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onReset?.(recipe.id);
  }, [onReset, recipe.id]);

  const handleRestoreClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onRestore?.(recipe.id);
  }, [onRestore, recipe.id]);

  const isModified = isModifiedSystemRecipe(recipe.id);
  const isDeleted = recipe.isDeleted;

  return (
    <div 
      className={`bg-card border rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${
        isExpanded ? 'ring-2 ring-primary/20' : ''
      } ${isDeleted ? 'opacity-60 border-red-200 bg-red-50/30' : ''} ${className}`}
      onClick={handleCardClick}
    >
      {/* Заголовок */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2 flex-1">
          <ChefHat className="h-5 w-5 text-primary flex-shrink-0" />
          <div className="flex items-center space-x-2">
            <h3 className={`text-lg font-semibold line-clamp-2 ${isDeleted ? 'text-red-600' : 'text-foreground'}`}>
              {recipe.name}
            </h3>
            {isDeleted && (
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                Удален
              </span>
            )}
            {!isDeleted && isModified && (
              <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                Изменен
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Описание */}
      {recipe.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {recipe.description}
        </p>
      )}

      {/* Информация об ингредиентах */}
      <div className="flex items-center space-x-4 mb-3 text-sm text-muted-foreground">
        <div className="flex items-center space-x-1">
          <Utensils className="h-4 w-4" />
          <span>{recipe.ingredients.length} ингредиентов</span>
        </div>
      </div>

      {/* Пищевая ценность */}
      <div className="bg-muted/50 rounded-lg p-3">
        <h4 className="text-sm font-medium text-foreground mb-2">
          Пищевая ценность всего:
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Калории:</span>
            <div className="font-medium text-foreground">
              {nutrition.totalCalories} ккал
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Белки:</span>
            <div className="font-medium text-foreground">
              {nutrition.totalProtein}г
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Жиры:</span>
            <div className="font-medium text-foreground">
              {nutrition.totalFat}г
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Углеводы:</span>
            <div className="font-medium text-foreground">
              {nutrition.totalCarbs}г
            </div>
          </div>
        </div>
      </div>

      {/* Список ингредиентов (краткий) */}
      <div className="mt-3">
        <h4 className="text-sm font-medium text-foreground mb-1">Ингредиенты:</h4>
        <div className="text-xs text-muted-foreground">
          {recipe.ingredients.slice(0, 3).map((ingredient, index) => {
            const product = getProductById(ingredient.productId);
            if (!product) return null;
            
            return (
              <span key={ingredient.productId}>
                {product.name}
                {index < Math.min(recipe.ingredients.length, 3) - 1 ? ', ' : ''}
              </span>
            );
          })}
          {recipe.ingredients.length > 3 && (
            <span> и ещё {recipe.ingredients.length - 3}...</span>
          )}
        </div>
      </div>

      {/* Кнопки управления (показываются при развертывании) */}
      {isExpanded && (
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex justify-end space-x-2 flex-wrap gap-2">
            {isDeleted ? (
              /* Кнопка восстановления для удалённых рецептов */
              <Button
                variant="outline"
                size="sm"
                onClick={handleRestoreClick}
                className="flex items-center space-x-2 text-green-600 border-green-300 hover:bg-green-600 hover:text-white max-[418px]:space-x-0 max-[418px]:px-2"
              >
                <Undo2 className="h-4 w-4" />
                <span className="max-[418px]:hidden">Восстановить</span>
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleViewClick}
                  className="flex items-center space-x-2 hover:bg-primary hover:text-primary-foreground max-[418px]:space-x-0 max-[418px]:px-2"
                >
                  <ChefHat className="h-4 w-4" />
                  <span className="max-[418px]:hidden">Просмотр</span>
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditClick}
                  className="flex items-center space-x-2 hover:bg-primary hover:text-primary-foreground max-[418px]:space-x-0 max-[418px]:px-2"
                >
                  <Edit className="h-4 w-4" />
                  <span className="max-[418px]:hidden">Ред</span>
                </Button>
                
                {/* Кнопка сброса для измененных системных рецептов */}
                {isModified && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetClick}
                    className="flex items-center space-x-2 text-orange-600 border-orange-300 hover:bg-orange-600 hover:text-white max-[418px]:space-x-0 max-[418px]:px-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span className="max-[418px]:hidden">Сбросить</span>
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteClick}
                  className="flex items-center space-x-2 text-destructive border-destructive hover:bg-destructive hover:text-white max-[418px]:space-x-0 max-[418px]:px-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="max-[418px]:hidden">Удалить</span>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Мемоизируем компонент для предотвращения ненужных перерендеров
const MemoizedRecipeCard = memo(RecipeCard);

// Экспорт с именем для совместимости
export { MemoizedRecipeCard as RecipeCard };
export default MemoizedRecipeCard;
