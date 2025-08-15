'use client';

import { Recipe, RecipeNutrition } from '@/lib/recipes-data';
import { getProductById } from '@/lib/products-data';
import { ChefHat, Utensils } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  nutrition: RecipeNutrition;
  onClick?: () => void;
  className?: string;
}

export function RecipeCard({ recipe, nutrition, onClick, className = '' }: RecipeCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`bg-card border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${className}`}
      onClick={handleClick}
    >
      {/* Заголовок */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2 flex-1">
          <ChefHat className="h-5 w-5 text-primary flex-shrink-0" />
          <h3 className="text-lg font-semibold text-foreground line-clamp-2">
            {recipe.name}
          </h3>
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
    </div>
  );
}
