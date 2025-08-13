'use client';

import { useState } from 'react';
import { Edit, Trash2, RotateCcw } from 'lucide-react';
import { Product, getCategoryName, isModifiedSystemProduct } from '@/lib/products-data';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  onReset?: (productId: string) => void;
}

export default function ProductCard({ product, onEdit, onDelete, onReset }: ProductCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(product);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(product.id);
  };

  const handleResetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onReset?.(product.id);
  };

  const isModified = isModifiedSystemProduct(product.id);

  return (
    <div 
      className={`bg-card p-3 sm:p-4 rounded-lg border shadow-sm transition-all duration-200 cursor-pointer hover:shadow-md ${
        isExpanded ? 'ring-2 ring-primary/20' : ''
      }`}
      onClick={handleCardClick}
    >
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        {/* Информация о продукте */}
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-lg sm:text-xl text-foreground leading-tight">{product.name}</h3>
            {isModified && (
              <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">
                Изменен
              </span>
            )}
          </div>
          <p className="text-base text-muted-foreground mt-1">{getCategoryName(product.category)}</p>
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
          </div>
        </div>
      )}
    </div>
  );
}
