'use client';

import { useEffect, useCallback, useMemo, memo, useState } from 'react';
import { X, Plus, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Recipe, RecipeIngredient } from '@/lib/recipes-data';
import { getProductById, getAllProducts } from '@/lib/products-data';
import { MEASUREMENT_UNITS, formatUnitDisplay } from '@/lib/units';
import { FormInput } from '@/components/FormField';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (recipe: Omit<Recipe, 'id'>, recipeId?: string) => void;
  recipe?: Recipe; // Если передан рецепт, то режим редактирования
  mode?: 'add' | 'edit';
}

function RecipeModal({ isOpen, onClose, onSubmit, recipe, mode = 'add' }: RecipeModalProps) {
  const isEditMode = mode === 'edit' && recipe;
  
  // Состояние формы
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ingredients: [] as RecipeIngredient[]
  });

  // Состояние поиска продуктов
  const [productSearch, setProductSearch] = useState('');
  const [showProductList, setShowProductList] = useState(false);

  // Ошибки валидации
  const [errors, setErrors] = useState({
    name: '',
    ingredients: ''
  });

  // Доступные продукты
  const availableProducts = useMemo(() => {
    const allProducts = getAllProducts();
    if (!productSearch) return allProducts.slice(0, 20); // Показываем первые 20 продуктов
    
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(productSearch.toLowerCase())
    ).slice(0, 20);
  }, [productSearch]);

  // Валидация формы
  const validateForm = useCallback(() => {
    const newErrors = { name: '', ingredients: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Название рецепта обязательно';
      isValid = false;
    }

    if (formData.ingredients.length === 0) {
      newErrors.ingredients = 'Добавьте хотя бы один ингредиент';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [formData]);

  // Сброс формы
  const resetForm = useCallback((initialRecipe?: Recipe) => {
    if (initialRecipe) {
      setFormData({
        name: initialRecipe.name,
        description: initialRecipe.description || '',
        ingredients: [...initialRecipe.ingredients]
      });
    } else {
      setFormData({
        name: '',
        description: '',
        ingredients: []
      });
    }
    setErrors({ name: '', ingredients: '' });
    setProductSearch('');
    setShowProductList(false);
  }, []);

  // Инициализация формы при открытии модалки
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && recipe) {
        resetForm(recipe);
      } else {
        resetForm();
      }
    }
  }, [isOpen, isEditMode, recipe, resetForm]);

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

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const recipeData: Omit<Recipe, 'id'> = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      ingredients: formData.ingredients
    };

    onSubmit(recipeData, isEditMode ? recipe?.id : undefined);
    handleClose();
  }, [formData, validateForm, onSubmit, isEditMode, recipe?.id]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  // Добавление ингредиента
  const addIngredient = useCallback((productId: string) => {
    const product = getProductById(productId);
    if (!product) return;

    // Проверяем, не добавлен ли уже этот продукт
    const existingIngredient = formData.ingredients.find(ing => ing.productId === productId);
    if (existingIngredient) return;

    const newIngredient: RecipeIngredient = {
      productId,
      amount: 100, // По умолчанию 100 грамм
      unit: MEASUREMENT_UNITS.GRAMS_100
    };

    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, newIngredient]
    }));

    setProductSearch('');
    setShowProductList(false);
  }, [formData.ingredients]);

  // Удаление ингредиента
  const removeIngredient = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  }, []);

  // Обновление количества ингредиента
  const updateIngredientAmount = useCallback((index: number, amount: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => 
        i === index ? { ...ing, amount } : ing
      )
    }));
  }, []);

  // Обновление единицы измерения ингредиента
  const updateIngredientUnit = useCallback((index: number, unitKey: string) => {
    const unit = Object.values(MEASUREMENT_UNITS).find(u => 
      u.displayName === unitKey || u.type.toString() === unitKey
    );
    if (!unit) return;

    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => 
        i === index ? { ...ing, unit } : ing
      )
    }));
  }, []);

  if (!isOpen) return null;

  const title = isEditMode ? 'Редактировать рецепт' : 'Создать рецепт';
  const submitButtonText = isEditMode ? 'Сохранить изменения' : 'Создать рецепт';

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center min-[420px]:p-4 z-50"
      onClick={handleClose}
    >
      <div 
        className="bg-background min-[420px]:rounded-lg border shadow-lg w-full min-[420px]:max-w-2xl h-full min-[420px]:h-auto min-[420px]:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between p-4 min-[420px]:p-6 border-b">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-secondary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="p-4 min-[420px]:p-6 space-y-6">
          {/* Название рецепта */}
          <FormInput
            id="name"
            name="name"
            label="Название рецепта"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            error={errors.name}
            placeholder="Например: Борщ домашний"
            mode={mode}
            required
          />

          {/* Описание */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
              Описание (опционально)
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Краткое описание рецепта..."
              className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              rows={3}
            />
          </div>

          {/* Ингредиенты */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-foreground">
                Ингредиенты
              </label>
              {errors.ingredients && (
                <span className="text-xs text-destructive">{errors.ingredients}</span>
              )}
            </div>

            {/* Список ингредиентов */}
            <div className="space-y-3 mb-4">
              {formData.ingredients.map((ingredient, index) => {
                const product = getProductById(ingredient.productId);
                if (!product) return null;

                return (
                  <div key={index} className="flex items-center gap-2 p-3 bg-secondary/30 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{product.name}</p>
                    </div>
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={ingredient.amount}
                      onChange={(e) => updateIngredientAmount(index, Number(e.target.value))}
                      className="w-20 px-2 py-1 text-sm border rounded"
                      placeholder="Кол-во"
                    />
                    <select
                      value={ingredient.unit.displayName}
                      onChange={(e) => updateIngredientUnit(index, e.target.value)}
                      className="px-2 py-1 text-sm border rounded"
                    >
                      <option value={MEASUREMENT_UNITS.GRAMS_100.displayName}>
                        {formatUnitDisplay(MEASUREMENT_UNITS.GRAMS_100)}
                      </option>
                      {product.measurementUnits?.map((unit, unitIndex) => (
                        <option key={unitIndex} value={unit.displayName}>
                          {formatUnitDisplay(unit)}
                        </option>
                      ))}
                    </select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeIngredient(index)}
                      className="p-1 h-auto text-destructive hover:bg-destructive hover:text-white"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Поиск и добавление продуктов */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Найти продукт для добавления..."
                  value={productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    setShowProductList(true);
                  }}
                  onFocus={() => setShowProductList(true)}
                  className="w-full pl-10 pr-4 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Список доступных продуктов */}
              {showProductList && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-input rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                  {availableProducts.length > 0 ? (
                    availableProducts.map((product) => {
                      const isAlreadyAdded = formData.ingredients.some(ing => ing.productId === product.id);
                      
                      return (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => addIngredient(product.id)}
                          disabled={isAlreadyAdded}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors ${
                            isAlreadyAdded ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {product.calories} ккал / 100г
                            {isAlreadyAdded && ' (уже добавлен)'}
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      Продукты не найдены
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!formData.name.trim() || formData.ingredients.length === 0}
            >
              {submitButtonText}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default memo(RecipeModal);
