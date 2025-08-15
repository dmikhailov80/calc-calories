'use client';

import { useState, useCallback, useEffect } from 'react';
import { Product } from '@/lib/products-data';
import { PRODUCT_CATEGORIES } from '@/lib/products-data';
import { MeasurementUnit } from '@/lib/units';
import { validateProductForm, ProductFormData } from '@/lib/validation';

export interface ProductFormState {
  name: string;
  category: string;
  calories: string;
  protein: string;
  fat: string;
  carbs: string;
  measurementUnits: MeasurementUnit[];
}

export interface FormErrors {
  [key: string]: string;
}

export interface UseProductFormReturn {
  formData: ProductFormState;
  errors: FormErrors;
  isValid: boolean;
  isDirty: boolean;
  updateField: (field: keyof ProductFormState, value: string | MeasurementUnit[]) => void;
  validateForm: () => boolean;
  resetForm: (initialData?: Partial<Product>) => void;
  getValidatedData: () => ProductFormData | null;
  clearErrors: () => void;
  addMeasurementUnit: (unit: MeasurementUnit) => void;
  removeMeasurementUnit: (index: number) => void;
  updateMeasurementUnit: (index: number, newWeight: number) => void;
}

const initialFormState: ProductFormState = {
  name: '',
  category: PRODUCT_CATEGORIES.UNCATEGORIZED.key,
  calories: '',
  protein: '',
  fat: '',
  carbs: '',
  measurementUnits: []
};

/**
 * Custom hook для управления формой продукта с валидацией через Zod
 * Инкапсулирует логику валидации, состояния формы и обработки ошибок
 */
export function useProductForm(initialData?: Partial<Product>): UseProductFormReturn {
  const [formData, setFormData] = useState<ProductFormState>(() => {
    if (initialData) {
      return {
        name: initialData.name || '',
        category: initialData.category || PRODUCT_CATEGORIES.UNCATEGORIZED.key,
        calories: initialData.calories?.toString() || '',
        protein: initialData.protein?.toString() || '',
        fat: initialData.fat?.toString() || '',
        carbs: initialData.carbs?.toString() || '',
        measurementUnits: initialData.measurementUnits || []
      };
    }
    return initialFormState;
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Валидация формы
  const validateForm = useCallback((): boolean => {
    const validationResult = validateProductForm({
      name: formData.name,
      category: formData.category,
      calories: formData.calories,
      protein: formData.protein,
      fat: formData.fat,
      carbs: formData.carbs
    });

    if (validationResult.success) {
      setErrors({});
      setIsValid(true);
      return true;
    } else {
      setErrors(validationResult.errors);
      setIsValid(false);
      return false;
    }
  }, [formData]);

  // Обновление поля формы
  const updateField = useCallback((field: keyof ProductFormState, value: string | MeasurementUnit[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);

    // Очищаем ошибку для конкретного поля при изменении
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // Сброс формы
  const resetForm = useCallback((newInitialData?: Partial<Product>) => {
    if (newInitialData) {
      const newFormData = {
        name: newInitialData.name || '',
        category: newInitialData.category || PRODUCT_CATEGORIES.UNCATEGORIZED.key,
        calories: newInitialData.calories?.toString() || '',
        protein: newInitialData.protein?.toString() || '',
        fat: newInitialData.fat?.toString() || '',
        carbs: newInitialData.carbs?.toString() || '',
        measurementUnits: newInitialData.measurementUnits || []
      };
      setFormData(newFormData);
      
      // Валидируем форму для режима редактирования
      setTimeout(() => {
        const validationResult = validateProductForm({
          name: newFormData.name,
          category: newFormData.category,
          calories: newFormData.calories,
          protein: newFormData.protein,
          fat: newFormData.fat,
          carbs: newFormData.carbs
        });

        if (validationResult.success) {
          setErrors({});
          setIsValid(true);
        } else {
          setErrors(validationResult.errors);
          setIsValid(false);
        }
      }, 0);
    } else {
      setFormData(initialFormState);
      setErrors({});
      setIsValid(false);
    }
    setIsDirty(false);
  }, []);

  // Получение валидированных данных
  const getValidatedData = useCallback((): ProductFormData | null => {
    const validationResult = validateProductForm({
      name: formData.name,
      category: formData.category,
      calories: formData.calories,
      protein: formData.protein,
      fat: formData.fat,
      carbs: formData.carbs
    });

    if (validationResult.success) {
      return validationResult.data;
    }
    return null;
  }, [formData]);

  // Очистка ошибок
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Управление единицами измерения
  const addMeasurementUnit = useCallback((unit: MeasurementUnit) => {
    setFormData(prev => ({
      ...prev,
      measurementUnits: [...prev.measurementUnits, unit]
    }));
    setIsDirty(true);
  }, []);

  const removeMeasurementUnit = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      measurementUnits: prev.measurementUnits.filter((_, i) => i !== index)
    }));
    setIsDirty(true);
  }, []);

  const updateMeasurementUnit = useCallback((index: number, newWeight: number) => {
    setFormData(prev => ({
      ...prev,
      measurementUnits: prev.measurementUnits.map((unit, i) => 
        i === index 
          ? { 
              ...unit, 
              weightInGrams: newWeight, 
              displayName: unit.displayName.replace(/\(\d+г\)/, `(${newWeight}г)`) 
            }
          : unit
      )
    }));
    setIsDirty(true);
  }, []);

  // Автоматическая валидация при изменении данных
  useEffect(() => {
    if (isDirty) {
      // Debounce валидации для лучшего UX
      const timeoutId = setTimeout(() => {
        validateForm();
      }, 300);

      return () => clearTimeout(timeoutId);
    } else if (initialData) {
      // Валидация при загрузке данных для редактирования
      validateForm();
    }
  }, [formData, isDirty, validateForm, initialData]);

  return {
    formData,
    errors,
    isValid,
    isDirty,
    updateField,
    validateForm,
    resetForm,
    getValidatedData,
    clearErrors,
    addMeasurementUnit,
    removeMeasurementUnit,
    updateMeasurementUnit
  };
}
