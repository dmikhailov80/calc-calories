'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product, PRODUCT_CATEGORIES } from '@/lib/products-data';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: Omit<Product, 'id'>) => void;
}

export default function AddProductModal({ isOpen, onClose, onAdd }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: PRODUCT_CATEGORIES.UNCATEGORIZED,
    calories: '',
    protein: '',
    fat: '',
    carbs: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Очищаем ошибку для этого поля при изменении
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Название продукта обязательно';
    }

    if (!formData.calories || isNaN(Number(formData.calories)) || Number(formData.calories) < 0) {
      newErrors.calories = 'Введите корректное значение калорий';
    }

    if (!formData.protein || isNaN(Number(formData.protein)) || Number(formData.protein) < 0) {
      newErrors.protein = 'Введите корректное значение белков';
    }

    if (!formData.fat || isNaN(Number(formData.fat)) || Number(formData.fat) < 0) {
      newErrors.fat = 'Введите корректное значение жиров';
    }

    if (!formData.carbs || isNaN(Number(formData.carbs)) || Number(formData.carbs) < 0) {
      newErrors.carbs = 'Введите корректное значение углеводов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newProduct: Omit<Product, 'id'> = {
      name: formData.name.trim(),
      category: formData.category,
      calories: Number(formData.calories),
      protein: Number(formData.protein),
      fat: Number(formData.fat),
      carbs: Number(formData.carbs)
    };

    onAdd(newProduct);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      category: PRODUCT_CATEGORIES.UNCATEGORIZED,
      calories: '',
      protein: '',
      fat: '',
      carbs: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

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
          <h2 className="text-xl font-semibold text-foreground">Добавить продукт</h2>
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
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
              Название продукта
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-border'
              }`}
              placeholder="Например: Куриная грудка"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Категория */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-foreground mb-1">
              Категория
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {Object.values(PRODUCT_CATEGORIES).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Питательные вещества */}
          <div className="grid grid-cols-2 gap-4">
            {/* Калории */}
            <div>
              <label htmlFor="calories" className="block text-sm font-medium text-foreground mb-1">
                Калории (ккал) *
              </label>
              <input
                type="number"
                id="calories"
                name="calories"
                value={formData.calories}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.calories ? 'border-red-500' : 'border-border'
                }`}
                placeholder="0"
              />
              {errors.calories && <p className="text-red-500 text-sm mt-1">{errors.calories}</p>}
            </div>

            {/* Белки */}
            <div>
              <label htmlFor="protein" className="block text-sm font-medium text-foreground mb-1">
                Белки (г) *
              </label>
              <input
                type="number"
                id="protein"
                name="protein"
                value={formData.protein}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.protein ? 'border-red-500' : 'border-border'
                }`}
                placeholder="0"
              />
              {errors.protein && <p className="text-red-500 text-sm mt-1">{errors.protein}</p>}
            </div>

            {/* Жиры */}
            <div>
              <label htmlFor="fat" className="block text-sm font-medium text-foreground mb-1">
                Жиры (г) *
              </label>
              <input
                type="number"
                id="fat"
                name="fat"
                value={formData.fat}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.fat ? 'border-red-500' : 'border-border'
                }`}
                placeholder="0"
              />
              {errors.fat && <p className="text-red-500 text-sm mt-1">{errors.fat}</p>}
            </div>

            {/* Углеводы */}
            <div>
              <label htmlFor="carbs" className="block text-sm font-medium text-foreground mb-1">
                Углеводы (г) *
              </label>
              <input
                type="number"
                id="carbs"
                name="carbs"
                value={formData.carbs}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.carbs ? 'border-red-500' : 'border-border'
                }`}
                placeholder="0"
              />
              {errors.carbs && <p className="text-red-500 text-sm mt-1">{errors.carbs}</p>}
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
            >
              Добавить продукт
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
