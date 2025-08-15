'use client';

import { Recipe, RecipeNutrition } from '@/lib/recipes-data';
import { getProductById } from '@/lib/products-data';
import { ChefHat, Utensils, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecipeDetailsProps {
  recipe: Recipe;
  nutrition: RecipeNutrition;
  onClose: () => void;
  className?: string;
}

export function RecipeDetails({ recipe, nutrition, onClose, className = '' }: RecipeDetailsProps) {
  return (
    <div className={`bg-card border rounded-lg shadow-lg ${className}`}>
      {/* Заголовок с кнопкой закрытия */}
      <div className="flex items-center justify-between p-4 border-b max-[420px]:flex-shrink-0">
        <div className="flex items-center space-x-2">
          <ChefHat className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            {recipe.name}
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-6 max-[420px]:flex-1 max-[420px]:overflow-y-auto">
        {/* Описание */}
        {recipe.description && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Описание</h3>
            <p className="text-muted-foreground">{recipe.description}</p>
          </div>
        )}



        {/* Список ингредиентов */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Utensils className="h-5 w-5 text-foreground" />
            <h3 className="text-lg font-semibold text-foreground">{recipe.ingredients.length} ингредиентов</h3>
          </div>
          <div className="space-y-2">
            {recipe.ingredients.map((ingredient) => {
              const product = getProductById(ingredient.productId);
              if (!product) return null;

              // Рассчитываем вес в граммах
              const weightInGrams = (ingredient.amount * ingredient.unit.weightInGrams) / 100;

              return (
                <div 
                  key={ingredient.productId}
                  className="flex items-center justify-between py-2 px-3 bg-muted/30 rounded"
                >
                  <div className="flex-1">
                    <span className="font-medium text-foreground">{product.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">
                      {ingredient.unit.displayName !== '100г' 
                        ? `${ingredient.amount} × ${ingredient.unit.displayName}`
                        : `${weightInGrams}г`
                      }
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Пищевая ценность */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Пищевая ценность</h3>
          
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-3">Всего в рецепте:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Калории:</span>
                <span className="font-medium">{nutrition.totalCalories} ккал</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Белки:</span>
                <span className="font-medium">{nutrition.totalProtein}г</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Жиры:</span>
                <span className="font-medium">{nutrition.totalFat}г</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Углеводы:</span>
                <span className="font-medium">{nutrition.totalCarbs}г</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-muted-foreground">Общий вес:</span>
                <span className="font-medium">{nutrition.totalWeight}г</span>
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}
