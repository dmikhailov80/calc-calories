'use client';

import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { ChefHat, Search, Plus, Trash2 } from 'lucide-react';
import { useRecipes, useRecipeModal, useConfirmModal } from '@/hooks';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeDetails } from '@/components/RecipeDetails';
import RecipeModal from '@/components/RecipeModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import { Switch } from '@/components/ui/switch';
import { Recipe, getDeletedRecipesCount } from '@/lib/recipes-data';

export default function RecipesPage() {
  const { data: session, status } = useSession();
  const { 
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
    calculateNutrition 
  } = useRecipes();
  
  const { 
    modalState, 
    openAddModal, 
    openEditModal, 
    closeModal, 
    isEditMode 
  } = useRecipeModal();
  
  const { 
    deleteModal, 
    openDeleteModal, 
    closeDeleteModal 
  } = useConfirmModal();
  
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Подсчет удаленных рецептов
  const deletedCount = getDeletedRecipesCount();

  // Фильтрация рецептов по поисковому запросу
  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Мемоизированные обработчики для управления рецептами
  const handleEditRecipe = useCallback((recipe: Recipe) => {
    openEditModal(recipe);
  }, [openEditModal]);

  const handleDeleteRecipe = useCallback((recipeId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (recipe) {
      openDeleteModal(recipe);
    }
  }, [recipes, openDeleteModal]);

  const handleConfirmDelete = useCallback(async () => {
    if (deleteModal.product) {
      const success = await deleteRecipe(deleteModal.product.id);
      if (success) {
        closeDeleteModal();
      } else {
        alert('Произошла ошибка при удалении рецепта');
      }
    }
  }, [deleteModal.product, deleteRecipe, closeDeleteModal]);

  const handleResetRecipe = useCallback(async (recipeId: string) => {
    const success = await resetRecipe(recipeId);
    if (!success) {
      alert('Произошла ошибка при сбросе рецепта');
    }
  }, [resetRecipe]);

  const handleRestoreRecipe = useCallback(async (recipeId: string) => {
    const success = await restoreRecipe(recipeId);
    if (!success) {
      alert('Произошла ошибка при восстановлении рецепта');
    }
  }, [restoreRecipe]);

  const handleModalSubmit = useCallback(async (recipeData: Omit<Recipe, 'id'>, recipeId?: string) => {
    let success = false;
    
    if (isEditMode && recipeId) {
      // Режим редактирования
      const result = await updateRecipe(recipeId, recipeData);
      success = result !== null;
    } else {
      // Режим добавления
      const result = await addRecipe(recipeData);
      success = result !== null;
    }
    
    if (success) {
      closeModal();
    }
  }, [isEditMode, updateRecipe, addRecipe, closeModal]);

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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <ChefHat className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Рецепты</h1>
        </div>
        
        {/* Кнопки управления */}
        <div className="flex items-center space-x-3">
          {/* Переключатель показа удалённых рецептов */}
          <div className="flex items-center space-x-2">
            <label htmlFor="show-deleted-recipes" className="flex items-center space-x-2 cursor-pointer">
              <Switch
                id="show-deleted-recipes"
                checked={showDeleted}
                onCheckedChange={setShowDeleted}
                className="data-[state=checked]:bg-red-500"
              />
              <span className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Удалённые</span>
                {deletedCount > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                    {deletedCount}
                  </span>
                )}
              </span>
            </label>
          </div>

          {/* Кнопка добавления рецепта */}
          <button
            onClick={openAddModal}
            className="flex items-center justify-center sm:justify-start sm:space-x-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            aria-label="Создать рецепт"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline ml-0 sm:ml-0">Создать рецепт</span>
          </button>
        </div>
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
              onEdit={handleEditRecipe}
              onDelete={handleDeleteRecipe}
              onReset={handleResetRecipe}
              onRestore={handleRestoreRecipe}
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
          ) : showDeleted ? (
            <>
              <h3 className="text-lg font-medium text-foreground mb-2">
                Удалённых рецептов нет
              </h3>
              <p className="text-muted-foreground">
                Удалённые системные рецепты будут отображаться здесь
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

      {/* Модальное окно для создания/редактирования рецепта */}
      <RecipeModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        recipe={modalState.editingRecipe}
        mode={modalState.mode}
      />

      {/* Модальное окно подтверждения удаления */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        product={deleteModal.product}
      />
    </div>
  );
}
