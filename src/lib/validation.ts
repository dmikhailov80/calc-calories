import { z } from 'zod';
import { PRODUCT_CATEGORIES } from './products-data';
import { UnitType } from './units';

// Схема для единиц измерения
export const measurementUnitSchema = z.object({
  type: z.nativeEnum(UnitType, {
    message: 'Некорректный тип единицы измерения'
  }),
  size: z.string().optional(),
  weightInGrams: z
    .number({
      message: 'Вес должен быть числом'
    })
    .min(0.1, { message: 'Вес должен быть больше 0.1 грамма' })
    .max(10000, { message: 'Вес не может превышать 10 кг' }),
  displayName: z
    .string({
      message: 'Название должно быть строкой'
    })
    .min(1, { message: 'Название не может быть пустым' })
    .max(50, { message: 'Название слишком длинное (максимум 50 символов)' })
    .trim()
});

// Схема для продукта
export const productSchema = z.object({
  name: z
    .string({
      message: 'Название должно быть строкой'
    })
    .min(1, { message: 'Название продукта не может быть пустым' })
    .max(100, { message: 'Название слишком длинное (максимум 100 символов)' })
    .trim()
    .refine(
      (name) => name.length > 0,
      { message: 'Название не может состоять только из пробелов' }
    ),
    
  category: z
    .string({
      message: 'Категория должна быть строкой'
    })
    .refine(
      (category) => Object.values(PRODUCT_CATEGORIES).some(cat => cat.key === category),
      { message: 'Выбрана несуществующая категория' }
    ),
    
  calories: z
    .number({
      message: 'Калории должны быть числом'
    })
    .min(0, { message: 'Калории не могут быть отрицательными' })
    .max(2000, { message: 'Калории не могут превышать 2000 ккал на 100г' })
    .multipleOf(0.1, { message: 'Калории должны быть с точностью до 0.1' }),
    
  protein: z
    .number({
      message: 'Белки должны быть числом'
    })
    .min(0, { message: 'Белки не могут быть отрицательными' })
    .max(100, { message: 'Белки не могут превышать 100г на 100г продукта' })
    .multipleOf(0.1, { message: 'Белки должны быть с точностью до 0.1' }),
    
  fat: z
    .number({
      message: 'Жиры должны быть числом'
    })
    .min(0, { message: 'Жиры не могут быть отрицательными' })
    .max(100, { message: 'Жиры не могут превышать 100г на 100г продукта' })
    .multipleOf(0.1, { message: 'Жиры должны быть с точностью до 0.1' }),
    
  carbs: z
    .number({
      message: 'Углеводы должны быть числом'
    })
    .min(0, { message: 'Углеводы не могут быть отрицательными' })
    .max(100, { message: 'Углеводы не могут превышать 100г на 100г продукта' })
    .multipleOf(0.1, { message: 'Углеводы должны быть с точностью до 0.1' }),
    
  measurementUnits: z
    .array(measurementUnitSchema)
    .optional()
    .default([])
    .refine(
      (units) => units.length <= 10,
      { message: 'Нельзя добавить больше 10 единиц измерения' }
    )
}).refine(
  (data) => {
    // Проверяем, что сумма БЖУ не превышает разумные пределы
    const total = data.protein + data.fat + data.carbs;
    return total <= 110; // Даем небольшой запас для погрешности и клетчатки
  },
  {
    message: 'Сумма белков, жиров и углеводов не может превышать 110г на 100г продукта',
    path: ['protein'] // Показываем ошибку на поле белков
  }
);

// Схема для формы продукта (строковые значения из input'ов)
export const productFormSchema = z.object({
  name: z.string().min(1, 'Название продукта обязательно').trim(),
  category: z.string().min(1, 'Категория обязательна'),
  calories: z.string().min(1, 'Калории обязательны'),
  protein: z.string().min(1, 'Белки обязательны'),
  fat: z.string().min(1, 'Жиры обязательны'),
  carbs: z.string().min(1, 'Углеводы обязательны')
}).transform((data) => {
  // Преобразуем строки в числа для дальнейшей валидации
  const calories = parseFloat(data.calories);
  const protein = parseFloat(data.protein);
  const fat = parseFloat(data.fat);
  const carbs = parseFloat(data.carbs);
  
  // Проверяем, что все значения валидны
  if (isNaN(calories)) throw new z.ZodError([{
    code: 'custom',
    path: ['calories'],
    message: 'Калории должны быть числом'
  }]);
  
  if (isNaN(protein)) throw new z.ZodError([{
    code: 'custom',
    path: ['protein'],
    message: 'Белки должны быть числом'
  }]);
  
  if (isNaN(fat)) throw new z.ZodError([{
    code: 'custom',
    path: ['fat'],
    message: 'Жиры должны быть числом'
  }]);
  
  if (isNaN(carbs)) throw new z.ZodError([{
    code: 'custom',
    path: ['carbs'],
    message: 'Углеводы должны быть числом'
  }]);
  
  return {
    name: data.name,
    category: data.category,
    calories,
    protein,
    fat,
    carbs
  };
});

// Типы для TypeScript
export type ProductFormData = z.infer<typeof productFormSchema>;
export type ProductValidationData = z.infer<typeof productSchema>;
export type MeasurementUnitValidationData = z.infer<typeof measurementUnitSchema>;

// Функция для валидации продукта с подробными ошибками
export function validateProduct(data: unknown) {
  try {
    return {
      success: true as const,
      data: productSchema.parse(data),
      errors: {}
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      
      error.issues.forEach((err: z.ZodIssue) => {
        const path = err.path.join('.');
        fieldErrors[path] = err.message;
      });
      
      return {
        success: false as const,
        data: null,
        errors: fieldErrors
      };
    }
    
    return {
      success: false as const,
      data: null,
      errors: { general: 'Произошла ошибка валидации' }
    };
  }
}

// Функция для валидации формы продукта
export function validateProductForm(data: unknown) {
  try {
    const parsedData = productFormSchema.parse(data);
    
    // Дополнительная валидация с основной схемой
    const fullValidation = validateProduct({
      ...parsedData,
      measurementUnits: []
    });
    
    if (fullValidation.success) {
      return {
        success: true as const,
        data: parsedData,
        errors: {}
      };
    } else {
      return fullValidation;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      
      error.issues.forEach((err: z.ZodIssue) => {
        const path = err.path.join('.');
        fieldErrors[path] = err.message;
      });
      
      return {
        success: false as const,
        data: null,
        errors: fieldErrors
      };
    }
    
    return {
      success: false as const,
      data: null,
      errors: { general: 'Произошла ошибка валидации формы' }
    };
  }
}

// Функция для валидации единицы измерения
export function validateMeasurementUnit(data: unknown) {
  try {
    return {
      success: true as const,
      data: measurementUnitSchema.parse(data),
      errors: {}
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      
      error.issues.forEach((err: z.ZodIssue) => {
        const path = err.path.join('.');
        fieldErrors[path] = err.message;
      });
      
      return {
        success: false as const,
        data: null,
        errors: fieldErrors
      };
    }
    
    return {
      success: false as const,
      data: null,
      errors: { general: 'Произошла ошибка валидации единицы измерения' }
    };
  }
}
