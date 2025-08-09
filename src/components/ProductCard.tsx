'use client';

import { Product } from '@/lib/products-data';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-card p-3 sm:p-4 rounded-lg border shadow-sm">
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        {/* Информация о продукте */}
        <div className="flex-1">
          <h3 className="font-semibold text-lg sm:text-xl text-foreground leading-tight">{product.name}</h3>
          <p className="text-base text-muted-foreground mt-1">{product.category}</p>
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
    </div>
  );
}
