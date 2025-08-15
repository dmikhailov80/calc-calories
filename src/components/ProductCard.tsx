'use client';

import { memo, useCallback } from 'react';
import { Edit, Trash2, RotateCcw, Undo2 } from 'lucide-react';
import { Product, getCategoryName, isModifiedSystemProduct, getProductMeasurementUnits } from '@/lib/products-data';
import { Button } from '@/components/ui/button';
import { formatUnitDisplay } from '@/lib/units';

interface ProductCardProps {
  product: Product;
  isExpanded?: boolean;
  onCardClick?: (productId: string) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  onReset?: (productId: string) => void;
  onRestore?: (productId: string) => void;
}

function ProductCard({ product, isExpanded = false, onCardClick, onEdit, onDelete, onReset, onRestore }: ProductCardProps) {
  const handleCardClick = useCallback(() => {
    onCardClick?.(product.id);
  }, [onCardClick, product.id]);

  const handleEditClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(product);
  }, [onEdit, product]);

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(product.id);
  }, [onDelete, product.id]);

  const handleResetClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onReset?.(product.id);
  }, [onReset, product.id]);

  const handleRestoreClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onRestore?.(product.id);
  }, [onRestore, product.id]);

  const isModified = isModifiedSystemProduct(product.id);
  const isDeleted = product.isDeleted;

  return (
    <div 
      className={`bg-card p-3 sm:p-4 rounded-lg border shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md ${
        isExpanded ? 'ring-2 ring-primary/20' : ''
      } ${isDeleted ? 'opacity-60 border-red-200 bg-red-50/30' : ''}`}
      onClick={handleCardClick}
    >
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        {/* Информация о продукте */}
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className={`font-semibold text-lg sm:text-xl leading-tight ${isDeleted ? 'text-red-600' : 'text-foreground'}`}>
              {product.name}
            </h3>
            {isDeleted && (
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                Удален
              </span>
            )}
            {!isDeleted && isModified && (
              <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                Изменен
              </span>
            )}
          </div>
          <div className="mt-1">
            <p className="text-base text-muted-foreground">{getCategoryName(product.category)}</p>
            {product.measurementUnits && product.measurementUnits.length > 0 && (
              <div className="text-sm text-muted-foreground mt-1">
                <p className="font-medium">Доступные единицы:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {product.measurementUnits.map((unit, index) => (
                    <span key={index} className="inline-block bg-secondary/50 px-2 py-1 rounded text-xs">
                      {formatUnitDisplay(unit)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Питательные данные */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          <div className="text-center">
            <p className="font-bold text-base sm:text-lg text-foreground">{product.calories}</p>
            <p className="text-sm text-muted-foreground">ккал</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-base sm:text-lg text-foreground">{product.protein}</p>
            <p className="text-sm text-muted-foreground">белки</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-base sm:text-lg text-foreground">{product.fat}</p>
            <p className="text-sm text-muted-foreground">жиры</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-base sm:text-lg text-foreground">{product.carbs}</p>
            <p className="text-sm text-muted-foreground">углеводы</p>
          </div>
        </div>
      </div>
      
      {/* Кнопки управления (показываются при развертывании) */}
      {isExpanded && (
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex justify-end space-x-2 flex-wrap gap-2">
            {isDeleted ? (
              /* Кнопка восстановления для удалённых продуктов */
              <Button
                variant="outline"
                size="sm"
                onClick={handleRestoreClick}
                className="flex items-center space-x-2 text-green-600 border-green-300 hover:bg-green-600 hover:text-white max-[418px]:space-x-0 max-[418px]:px-2"
              >
                <Undo2 className="h-4 w-4" />
                <span className="max-[418px]:hidden">Восстановить</span>
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditClick}
                  className="flex items-center space-x-2 hover:bg-primary hover:text-primary-foreground max-[418px]:space-x-0 max-[418px]:px-2"
                >
                  <Edit className="h-4 w-4" />
                  <span className="max-[418px]:hidden">Ред</span>
                </Button>
                
                {/* Кнопка сброса для измененных системных продуктов */}
                {isModified && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetClick}
                    className="flex items-center space-x-2 text-orange-600 border-orange-300 hover:bg-orange-600 hover:text-white max-[418px]:space-x-0 max-[418px]:px-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span className="max-[418px]:hidden">Сбросить</span>
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDeleteClick}
                  className="flex items-center space-x-2 text-destructive border-destructive hover:bg-destructive hover:text-white max-[418px]:space-x-0 max-[418px]:px-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="max-[418px]:hidden">Удалить</span>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Мемоизируем компонент для предотвращения ненужных перерендеров
export default memo(ProductCard);
