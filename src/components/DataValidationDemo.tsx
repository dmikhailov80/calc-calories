'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { migrateUserProducts, formatMigrationReport } from '@/lib/data-migration';

export function DataValidationDemo() {
  const [result, setResult] = useState<string>('');

  const testInvalidData = () => {
    // Создаем тестовые данные с различными проблемами
    const invalidData = [
      // Продукт с неверным ID
      {
        id: 'invalid-id-123',
        name: 'Тестовый продукт 1',
        category: 'DAIRY',
        calories: 100,
        protein: 5,
        fat: 3,
        carbs: 10
      },
      // Продукт с несуществующей категорией
      {
        id: '550e8400-e29b-41d4-a716-446655440999',
        name: 'Тестовый продукт 2', 
        category: 'NONEXISTENT_CATEGORY',
        calories: 200,
        protein: 10,
        fat: 6,
        carbs: 20
      },
      // Продукт с отсутствующими полями
      {
        id: '550e8400-e29b-41d4-a716-446655440998',
        name: 'Тестовый продукт 3',
        category: 'MEAT_FISH'
        // calories, protein, fat, carbs отсутствуют
      },
      // Продукт с лишними полями и неверными типами
      {
        id: '550e8400-e29b-41d4-a716-446655440997',
        name: 123, // неверный тип
        category: 'VEGETABLES',
        calories: 'not-a-number', // неверный тип
        protein: -5, // отрицательное значение
        fat: 2,
        carbs: 15,
        extraField: 'should be removed',
        anotherField: { nested: 'object' }
      },
      // Дублированный ID
      {
        id: '550e8400-e29b-41d4-a716-446655440999', // тот же что у продукта 2
        name: 'Дублированный продукт',
        category: 'FRUITS',
        calories: 50,
        protein: 1,
        fat: 0.5,
        carbs: 12
      }
    ];

    const migrationResult = migrateUserProducts(invalidData);
    const report = formatMigrationReport(migrationResult.issues);
    
    setResult(`Результат миграции:\n\n${report}\n\nМигрированные продукты:\n${JSON.stringify(migrationResult.migratedProducts, null, 2)}`);
  };

  const testValidData = () => {
    const validData = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Валидный продукт',
        category: 'DAIRY',
        calories: 100,
        protein: 5,
        fat: 3,
        carbs: 10
      }
    ];

    const migrationResult = migrateUserProducts(validData);
    const report = formatMigrationReport(migrationResult.issues);
    
    setResult(`Результат миграции:\n\n${report}\n\nИзменений не требуется.`);
  };

  const clearResult = () => {
    setResult('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Демо валидации данных</h2>
      <p className="text-gray-600 mb-6">
        Тестирование системы автоматического исправления проблем в данных пользователя.
      </p>
      
      <div className="flex gap-4 mb-6">
        <Button onClick={testInvalidData} variant="outline">
          Тест с проблемными данными
        </Button>
        <Button onClick={testValidData} variant="outline">
          Тест с корректными данными
        </Button>
        <Button onClick={clearResult} variant="outline">
          Очистить результат
        </Button>
      </div>

      {result && (
        <div className="bg-gray-50 border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Результат:</h3>
          <pre className="whitespace-pre-wrap text-sm text-gray-700 max-h-96 overflow-y-auto">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
