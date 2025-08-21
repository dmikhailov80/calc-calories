'use client';

import { X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Recipe, isUserRecipe } from '@/lib/recipes-data';

interface DeleteRecipeConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recipe: Recipe | null;
}

export default function DeleteRecipeConfirmModal({ isOpen, onClose, onConfirm, recipe }: DeleteRecipeConfirmModalProps) {
  if (!isOpen || !recipe) return null;

  const isSystem = !isUserRecipe(recipe.id);
  const title = isSystem ? 'Скрыть системный рецепт' : 'Удалить рецепт';
  
  const description = isSystem 
    ? 'Этот системный рецепт будет скрыт из списка. Вы сможете восстановить его через настройки приложения в будущем.'
    : 'Этот пользовательский рецепт будет удален навсегда. Это действие нельзя отменить.';

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center min-[420px]:p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-background min-[420px]:rounded-lg border shadow-lg w-full min-[420px]:max-w-md mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between p-4 min-[420px]:p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
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
          {/* Информация о рецепте */}
          <div className="bg-secondary/30 p-3 rounded-lg">
            <p className="font-semibold text-foreground">{recipe.name}</p>
            {recipe.description && (
              <p className="text-sm text-muted-foreground">
                {recipe.description}
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              Ингредиентов: {recipe.ingredients.length}
            </p>
          </div>

          {/* Описание действия */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
            
            {isSystem && (
              <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Информация:</strong> Системный рецепт будет помечен как скрытый в ваших персональных настройках, 
                  но останется доступным для других пользователей.
                </p>
              </div>
            )}
          </div>

          {/* Кнопки */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirm}
              className="flex-1"
            >
              {isSystem ? 'Скрыть' : 'Удалить'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
