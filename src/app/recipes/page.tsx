'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { ChefHat, Search, Plus } from 'lucide-react';
import { useRecipes } from '@/hooks/useRecipes';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeDetails } from '@/components/RecipeDetails';
import { Recipe } from '@/lib/recipes-data';

export default function RecipesPage() {
  const { data: session, status } = useSession();
  const { recipes, loading, error, calculateNutrition } = useRecipes();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтрация рецептов по поисковому запросу
  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-card p-8 rounded-lg border shadow-sm text-center max-w-md w-full">
          <h1 className="text-2xl font-bold text-foreground mb-4">Доступ запрещен</h1>
          <p className="text-muted-foreground">Войдите в систему для просмотра рецептов</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 lg:p-6">
        <div className="flex items-center space-x-3 mb-6">
          <ChefHat className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Рецепты</h1>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Загрузка рецептов...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 lg:p-6">
        <div className="flex items-center space-x-3 mb-6">
          <ChefHat className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Рецепты</h1>
        </div>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
          <p className="text-destructive font-medium">Ошибка загрузки рецептов</p>
          <p className="text-muted-foreground text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-6">
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <ChefHat className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Рецепты</h1>
        </div>
        
        {/* Кнопка добавления рецепта (пока заглушка) */}
        <button 
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          onClick={() => {
            // TODO: Добавить функционал создания рецепта
            alert('Функционал создания рецептов будет добавлен в следующих обновлениях');
          }}
        >
          <Plus className="h-4 w-4" />
          <span>Создать рецепт</span>
        </button>
      </div>

      {/* Поиск */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Поиск рецептов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {/* Список рецептов */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              nutrition={calculateNutrition(recipe)}
              onClick={() => setSelectedRecipe(recipe)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ChefHat className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          {searchQuery ? (
            <>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Рецепты не найдены
              </h3>
              <p className="text-muted-foreground">
                Попробуйте изменить поисковый запрос
              </p>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Рецепты загружаются...
              </h3>
              <p className="text-muted-foreground">
                Системные рецепты должны появиться автоматически
              </p>
            </>
          )}
        </div>
      )}

      {/* Модальное окно с деталями рецепта */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 max-[420px]:p-0 z-50">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto max-[420px]:max-w-none max-[420px]:max-h-full max-[420px]:h-full">
            <RecipeDetails
              recipe={selectedRecipe}
              nutrition={calculateNutrition(selectedRecipe)}
              onClose={() => setSelectedRecipe(null)}
              className="max-[420px]:rounded-none max-[420px]:h-full max-[420px]:flex max-[420px]:flex-col"
            />
          </div>
        </div>
      )}
    </div>
  );
}
