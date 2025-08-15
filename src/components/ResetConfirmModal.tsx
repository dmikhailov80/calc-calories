'use client';

import { useEffect } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product, getCategoryName } from '@/lib/products-data';
import { MeasurementUnit } from '@/lib/units';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  product: Product | null;
  originalProduct: Product | null;
}

export default function ResetConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  product, 
  originalProduct 
}: ResetConfirmModalProps) {
  // Функция для получения добавленных единиц измерения (полностью новые типы/размеры)
  const getAddedUnits = (): MeasurementUnit[] => {
    if (!product?.measurementUnits) return [];
    if (!originalProduct?.measurementUnits) return product.measurementUnits;
    
    return product.measurementUnits.filter(currentUnit => 
      !originalProduct.measurementUnits.some(originalUnit => 
        currentUnit.type === originalUnit.type && currentUnit.size === originalUnit.size
      )
    );
  };

  // Функция для получения удаленных единиц измерения (полностью отсутствующие типы/размеры)
  const getRemovedUnits = (): MeasurementUnit[] => {
    if (!originalProduct?.measurementUnits) return [];
    if (!product?.measurementUnits) return originalProduct.measurementUnits;
    
    return originalProduct.measurementUnits.filter(originalUnit => 
      !product.measurementUnits.some(currentUnit => 
        originalUnit.type === currentUnit.type && originalUnit.size === currentUnit.size
      )
    );
  };

  // Функция для получения измененных единиц измерения (те же типы/размеры, но разные веса или названия)
  const getModifiedUnits = (): { current: MeasurementUnit; original: MeasurementUnit }[] => {
    if (!product?.measurementUnits || !originalProduct?.measurementUnits) return [];
    
    const modified: { current: MeasurementUnit; original: MeasurementUnit }[] = [];
    
    product.measurementUnits.forEach(currentUnit => {
      const originalUnit = originalProduct.measurementUnits.find(ou => 
        ou.type === currentUnit.type && ou.size === currentUnit.size
      );
      
      if (originalUnit && (
        originalUnit.weightInGrams !== currentUnit.weightInGrams ||
        originalUnit.displayName !== currentUnit.displayName
      )) {
        modified.push({ current: currentUnit, original: originalUnit });
      }
    });
    
    return modified;
  };

  // Функция для сравнения единиц измерения
  const measurementUnitsChanged = () => {
    if (!product?.measurementUnits || !originalProduct?.measurementUnits) {
      return (product?.measurementUnits?.length || 0) !== (originalProduct?.measurementUnits?.length || 0);
    }
    
    // Проверяем различия через наши специализированные функции
    const added = getAddedUnits();
    const removed = getRemovedUnits();
    const modified = getModifiedUnits();
    
    return added.length > 0 || removed.length > 0 || modified.length > 0;
  };

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

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (!isOpen || !product || !originalProduct) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center min-[420px]:p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-background min-[420px]:rounded-lg border shadow-lg w-full min-[420px]:max-w-md h-full min-[420px]:h-auto min-[420px]:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between p-4 min-[420px]:p-6 border-b">
          <div className="flex items-center space-x-3">
            <RotateCcw className="h-6 w-6 text-orange-500" />
            <h2 className="text-xl font-semibold text-foreground">Сброс изменений</h2>
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
          {/* Предупреждение */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm font-medium text-orange-800 mb-2">
              Вы действительно хотите сбросить изменения продукта?
            </p>
            <p className="text-sm text-orange-700">
              Это действие нельзя отменить. Все пользовательские изменения будут потеряны.
            </p>
          </div>

          {/* Информация о продукте */}
          <div className="bg-secondary/50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-3">
              {product.name !== originalProduct.name ? (
                <span>
                  <span className="text-red-600">{product.name}</span>
                  <span className="text-muted-foreground mx-2">→</span>
                  <span className="text-green-600">{originalProduct.name}</span>
                </span>
              ) : (
                product.name
              )}
            </h3>
            
            {/* Сравнение значений */}
            <div className="space-y-2">
              {/* Заголовок таблицы только если есть изменения */}
              {(product.name !== originalProduct.name || 
                product.category !== originalProduct.category ||
                product.calories !== originalProduct.calories ||
                product.protein !== originalProduct.protein ||
                product.fat !== originalProduct.fat ||
                product.carbs !== originalProduct.carbs ||
                measurementUnitsChanged()) && (
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="font-medium text-muted-foreground">Показатель</div>
                  <div className="font-medium text-red-600">Текущее</div>
                  <div className="font-medium text-green-600">Будет восстановлено</div>
                </div>
              )}
              
              {/* Название, если изменено */}
              {product.name !== originalProduct.name && (
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>Название:</div>
                  <div className="text-red-600">{product.name}</div>
                  <div className="text-green-600">{originalProduct.name}</div>
                </div>
              )}
              
              {/* Категория, если изменена */}
              {product.category !== originalProduct.category && (
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>Категория:</div>
                  <div className="text-red-600">{getCategoryName(product.category)}</div>
                  <div className="text-green-600">{getCategoryName(originalProduct.category)}</div>
                </div>
              )}
              
              {/* Калории, если изменены */}
              {product.calories !== originalProduct.calories && (
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>Калории:</div>
                  <div className="text-red-600">{product.calories}</div>
                  <div className="text-green-600">{originalProduct.calories}</div>
                </div>
              )}
              
              {/* Белки, если изменены */}
              {product.protein !== originalProduct.protein && (
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>Белки:</div>
                  <div className="text-red-600">{product.protein}</div>
                  <div className="text-green-600">{originalProduct.protein}</div>
                </div>
              )}
              
              {/* Жиры, если изменены */}
              {product.fat !== originalProduct.fat && (
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>Жиры:</div>
                  <div className="text-red-600">{product.fat}</div>
                  <div className="text-green-600">{originalProduct.fat}</div>
                </div>
              )}
              
              {/* Углеводы, если изменены */}
              {product.carbs !== originalProduct.carbs && (
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>Углеводы:</div>
                  <div className="text-red-600">{product.carbs}</div>
                  <div className="text-green-600">{originalProduct.carbs}</div>
                </div>
              )}

              {/* Единицы измерения, если изменены */}
              {measurementUnitsChanged() && (
                <div className="border-t pt-2 mt-2">
                  <div className="font-medium text-muted-foreground mb-2 text-sm">Единицы измерения:</div>
                  
                  {/* Добавленные единицы */}
                  {getAddedUnits().map((unit, index) => (
                    <div key={`added-${index}`} className="grid grid-cols-3 gap-2 text-sm py-1">
                      <div className="text-muted-foreground">Добавлено:</div>
                      <div className="text-green-600">{unit.displayName} ({unit.weightInGrams}г)</div>
                      <div className="text-red-600">будет удалено</div>
                    </div>
                  ))}
                  
                  {/* Удаленные единицы */}
                  {getRemovedUnits().map((unit, index) => (
                    <div key={`removed-${index}`} className="grid grid-cols-3 gap-2 text-sm py-1">
                      <div className="text-muted-foreground">Удалено:</div>
                      <div className="text-red-600">отсутствует</div>
                      <div className="text-green-600">{unit.displayName} ({unit.weightInGrams}г)</div>
                    </div>
                  ))}
                  
                  {/* Измененные единицы */}
                  {getModifiedUnits().map((unitPair, index) => (
                    <div key={`modified-${index}`} className="grid grid-cols-3 gap-2 text-sm py-1">
                      <div className="text-muted-foreground">Изменено:</div>
                      <div className="text-red-600">{unitPair.current.displayName} ({unitPair.current.weightInGrams}г)</div>
                      <div className="text-green-600">{unitPair.original.displayName} ({unitPair.original.weightInGrams}г)</div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Сообщение если ничего не изменилось */}
              {!(product.name !== originalProduct.name || 
                product.category !== originalProduct.category ||
                product.calories !== originalProduct.calories ||
                product.protein !== originalProduct.protein ||
                product.fat !== originalProduct.fat ||
                product.carbs !== originalProduct.carbs ||
                measurementUnitsChanged()) && (
                <div className="text-center text-muted-foreground text-sm py-2">
                  Нет изменений для сброса
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex space-x-3 p-4 min-[420px]:p-6 border-t">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Отмена
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
          >
            Сбросить изменения
          </Button>
        </div>
      </div>
    </div>
  );
}
