'use client';

import { useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product, PRODUCT_CATEGORIES } from '@/lib/products-data';
import { MeasurementUnit, MEASUREMENT_UNITS } from '@/lib/units';
import { useProductForm } from '@/hooks';
import { FormInput, FormSelect } from '@/components/FormField';
import ValidationSummary from '@/components/ValidationSummary';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Omit<Product, 'id'>, productId?: string) => void;
  product?: Product; // Если передан продукт, то режим редактирования
  mode?: 'add' | 'edit';
}

export default function ProductModal({ isOpen, onClose, onSubmit, product, mode = 'add' }: ProductModalProps) {
  const isEditMode = mode === 'edit' && product;

  // Используем новый хук для управления формой
  const {
    formData,
    errors,
    isValid,
    isDirty,
    updateField,
    validateForm,
    resetForm,
    getValidatedData,
    addMeasurementUnit,
    removeMeasurementUnit,
    updateMeasurementUnit
  } = useProductForm(isEditMode ? product : undefined);

  // Сброс формы при открытии/закрытии модалки
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && product) {
        resetForm(product);
      } else {
        resetForm();
      }
    }
  }, [isOpen, isEditMode, product, resetForm]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateField(name as keyof typeof formData, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validatedData = getValidatedData();
    if (!validatedData || !validateForm()) {
      return;
    }

    const productData: Omit<Product, 'id'> = {
      name: validatedData.name.trim(),
      category: validatedData.category,
      calories: validatedData.calories,
      protein: validatedData.protein,
      fat: validatedData.fat,
      carbs: validatedData.carbs,
      measurementUnits: formData.measurementUnits
    };

    onSubmit(productData, isEditMode ? product.id : undefined);
    handleClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Функции для управления единицами измерения теперь приходят из хука

  if (!isOpen) return null;

  const title = isEditMode ? 'Редактировать продукт' : 'Добавить продукт';
  const submitButtonText = isEditMode ? 'Сохранить изменения' : 'Добавить продукт';

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center min-[420px]:p-4 z-50"
      onClick={handleClose}
    >
      <div 
        className="bg-background min-[420px]:rounded-lg border shadow-lg w-full min-[420px]:max-w-md h-full min-[420px]:h-auto min-[420px]:max-h-[90vh] overflow-y-auto"
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
        <form onSubmit={handleSubmit} className="p-4 min-[420px]:p-6 space-y-4">
          {/* Название продукта */}
          <FormInput
            id="name"
            name="name"
            label="Название продукта"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            placeholder="Например: Куриная грудка"
            mode={mode}
            required
          />

          {/* Категория */}
          <FormSelect
            id="category"
            name="category"
            label="Категория"
            value={formData.category}
            onChange={handleInputChange}
            error={errors.category}
            options={Object.values(PRODUCT_CATEGORIES).map(cat => ({
              value: cat.key,
              label: cat.name
            }))}
            mode={mode}
            required
          />



          {/* Питательные вещества */}
          <div className="grid grid-cols-2 gap-4">
            {/* Калории */}
            <FormInput
              id="calories"
              name="calories"
              label="Калории (ккал)"
              type="number"
              value={formData.calories}
              onChange={handleInputChange}
              error={errors.calories}
              min="0"
              step="0.1"
              placeholder="0"
              mode={mode}
              required
            />

            {/* Белки */}
            <FormInput
              id="protein"
              name="protein"
              label="Белки (г)"
              type="number"
              value={formData.protein}
              onChange={handleInputChange}
              error={errors.protein}
              min="0"
              step="0.1"
              placeholder="0"
              mode={mode}
              required
            />

            {/* Жиры */}
            <FormInput
              id="fat"
              name="fat"
              label="Жиры (г)"
              type="number"
              value={formData.fat}
              onChange={handleInputChange}
              error={errors.fat}
              min="0"
              step="0.1"
              placeholder="0"
              mode={mode}
              required
            />

            {/* Углеводы */}
            <FormInput
              id="carbs"
              name="carbs"
              label="Углеводы (г)"
              type="number"
              value={formData.carbs}
              onChange={handleInputChange}
              error={errors.carbs}
              min="0"
              step="0.1"
              placeholder="0"
              mode={mode}
              required
            />
          </div>

          {/* Единицы измерения */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Единицы измерения
            </label>
            
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 p-2 bg-primary/10 rounded">
                <span className="flex-1 text-sm font-medium">100г (базовая единица)</span>
                <span className="text-xs text-muted-foreground">всегда доступно</span>
              </div>
              {formData.measurementUnits.map((unit, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-secondary/30 rounded">
                  <span className="flex-1 text-sm">{unit.displayName}</span>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={unit.weightInGrams}
                    onChange={(e) => updateMeasurementUnit(index, Number(e.target.value))}
                    className="w-20 px-2 py-1 text-sm border rounded"
                    placeholder="Вес"
                  />
                  <span className="text-sm text-muted-foreground">г</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeMeasurementUnit(index)}
                    className="p-1 h-auto"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              {/* Штуки */}
              <div>
                <span className="text-sm font-medium text-foreground mb-2 block">Штуки:</span>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addMeasurementUnit(MEASUREMENT_UNITS.PIECE_SMALL)}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Маленькая (30г)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addMeasurementUnit(MEASUREMENT_UNITS.PIECE_MEDIUM)}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Средняя (50г)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addMeasurementUnit(MEASUREMENT_UNITS.PIECE_LARGE)}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Большая (70г)
                  </Button>
                </div>
              </div>

              {/* Ложки */}
              <div>
                <span className="text-sm font-medium text-foreground mb-2 block">Ложки:</span>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addMeasurementUnit(MEASUREMENT_UNITS.TEASPOON)}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Чайная (5г)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addMeasurementUnit(MEASUREMENT_UNITS.TABLESPOON)}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Столовая (15г)
                  </Button>
                </div>
              </div>

              {/* Кусочки */}
              <div>
                <span className="text-sm font-medium text-foreground mb-2 block">Кусочки:</span>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addMeasurementUnit(MEASUREMENT_UNITS.SLICE_THIN)}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Тонкий (20г)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addMeasurementUnit(MEASUREMENT_UNITS.SLICE_MEDIUM)}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Средний (25г)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addMeasurementUnit(MEASUREMENT_UNITS.SLICE_THICK)}
                    className="text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Толстый (30г)
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Информация */}
          <div className="bg-secondary/50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              * Все значения указываются на 100 грамм продукта
            </p>
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
              disabled={!isValid || !isDirty}
            >
              {submitButtonText}
            </Button>
          </div>
          
          {/* Индикатор валидации */}
          <ValidationSummary
            isValid={isValid}
            isDirty={isDirty}
            errors={errors}
            mode={mode}
            className="mt-4"
          />
        </form>
      </div>
    </div>
  );
}
