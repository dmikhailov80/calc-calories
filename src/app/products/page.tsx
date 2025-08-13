'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import { BookOpen, Search, Info, Plus } from 'lucide-react';
import { getAllCategories, getProductsByCategory, searchProducts, PRODUCT_CATEGORIES, Product, getAllProducts, saveUserProduct, deleteUserProduct } from '@/lib/products-data';
import ProductCard from '@/components/ProductCard';
import AddProductModal from '@/components/AddProductModal';

export default function ProductsPage() {
  const { data: session, status } = useSession();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const infoRef = useRef<HTMLDivElement>(null);

  // Закрытие tooltip при клике вне его области
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
        setShowInfo(false);
      }
    }

    if (showInfo) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showInfo]);

  // Загрузка всех продуктов при монтировании компонента
  useEffect(() => {
    setProducts(getAllProducts());
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-card p-8 rounded-lg border shadow-sm text-center max-w-md w-full">
          <h1 className="text-2xl font-bold text-foreground mb-4">Доступ запрещен</h1>
          <p className="text-muted-foreground">Войдите в систему для просмотра продуктов</p>
        </div>
      </div>
    );
  }

  // Фильтрация продуктов
  const getFilteredProducts = () => {
    let filteredProducts = products;
    
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    if (selectedCategory !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
    }
    
    return filteredProducts;
  };

  const filteredProducts = getFilteredProducts();
  const categories = getAllCategories();

  // Обработчики для управления продуктами
  const handleEditProduct = (product: Product) => {
    // TODO: Реализовать модальное окно для редактирования продукта
    alert(`Редактирование продукта: ${product.name}\nЭта функция будет реализована в следующих обновлениях.`);
  };

  const handleDeleteProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product && confirm(`Вы уверены, что хотите удалить продукт "${product.name}"?`)) {
      if (deleteUserProduct(productId)) {
        setProducts(getAllProducts());
      } else {
        alert('Произошла ошибка при удалении продукта');
      }
    }
  };

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    try {
      saveUserProduct(newProduct);
      setProducts(getAllProducts());
    } catch (error) {
      alert('Произошла ошибка при добавлении продукта');
    }
  };

  return (
    <div className="container mx-auto p-4 lg:p-6 pb-20 lg:pb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Продукты</h1>
        </div>
        
        {/* Кнопки управления */}
        <div className="flex items-center space-x-2">
          {/* Кнопка добавления продукта */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center sm:justify-start sm:space-x-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            aria-label="Добавить продукт"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline ml-0 sm:ml-0">Добавить</span>
          </button>
          
          {/* Информационная иконка */}
          <div className="relative" ref={infoRef}>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
              aria-label="Информация о показателях"
            >
              <Info className="h-5 w-5 text-muted-foreground" />
            </button>
          
            {/* Tooltip */}
            {showInfo && (
              <div className="absolute right-0 top-full mt-2 bg-card border rounded-lg shadow-lg p-3 text-sm text-muted-foreground whitespace-nowrap z-10">
                <p>Все показатели указаны на 100 грамм продукта</p>
                <div className="absolute -top-1 right-3 w-2 h-2 bg-card border-t border-l rotate-45"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Поиск и фильтры */}
      <div className="mb-6 space-y-4">
        {/* Поиск */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск продуктов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Категории */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Все
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Список продуктов */}
      <div className="grid gap-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Продукты не найдены</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          ))
        )}
      </div>

      {/* Модальное окно добавления продукта */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddProduct}
      />
    </div>
  );
}
