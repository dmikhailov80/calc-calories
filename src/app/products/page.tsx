'use client';

import { useSession } from 'next-auth/react';
import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { BookOpen, Search, Info, Plus, EyeOff, Trash2 } from 'lucide-react';
import { Product, getDeletedSystemProducts } from '@/lib/products-data';
import { useProducts, useProductFilters, useProductModal, useConfirmModal, useInfoTooltip } from '@/hooks';
import { Switch } from '@/components/ui/switch';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import ResetConfirmModal from '@/components/ResetConfirmModal';

export default function ProductsPage() {
  const { data: session, status } = useSession();
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  
  // Custom hooks для управления состоянием
  const { 
    products, 
    loading: productsLoading, 
    error: productsError,
    showDeleted,
    setShowDeleted,
    addProduct, 
    updateProduct, 
    deleteProduct, 
    resetProduct, 
    restoreProduct,
    getOriginalProduct 
  } = useProducts();
  
  const { 
    filteredProducts, 
    categories, 
    filters,
    setSearchQuery, 
    setSelectedCategory 
  } = useProductFilters(products);
  
  const { 
    modalState, 
    openAddModal, 
    openEditModal, 
    closeModal, 
    isEditMode 
  } = useProductModal();
  
  const { 
    deleteModal, 
    resetModal, 
    openDeleteModal, 
    openResetModal, 
    closeDeleteModal, 
    closeResetModal 
  } = useConfirmModal();

  const {
    showInfo,
    toggleInfo,
    infoRef
  } = useInfoTooltip();

  // Обработчик клика по карточке продукта
  const handleCardClick = useCallback((productId: string) => {
    setExpandedProductId(expandedProductId === productId ? null : productId);
  }, [expandedProductId]);

  // Мемоизированные обработчики для управления продуктами
  const handleEditProduct = useCallback((product: Product) => {
    openEditModal(product);
  }, [openEditModal]);

  const handleDeleteProduct = useCallback((productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      openDeleteModal(product);
    }
  }, [products, openDeleteModal]);

  const handleConfirmDelete = useCallback(async () => {
    if (deleteModal.product) {
      const success = await deleteProduct(deleteModal.product.id);
      if (success) {
        closeDeleteModal();
      } else {
        alert('Произошла ошибка при удалении продукта');
      }
    }
  }, [deleteModal.product, deleteProduct, closeDeleteModal]);

  const handleResetProduct = useCallback((productId: string) => {
    const product = products.find(p => p.id === productId);
    const originalProduct = getOriginalProduct(productId);
    
    if (product && originalProduct) {
      openResetModal(product, originalProduct);
    }
  }, [products, getOriginalProduct, openResetModal]);

  const handleConfirmReset = useCallback(async () => {
    if (resetModal.product) {
      const success = await resetProduct(resetModal.product.id);
      if (success) {
        closeResetModal();
      } else {
        alert('Произошла ошибка при сбросе продукта');
      }
    }
  }, [resetModal.product, resetProduct, closeResetModal]);

  const handleRestoreProduct = useCallback(async (productId: string) => {
    const success = await restoreProduct(productId);
    if (!success) {
      alert('Произошла ошибка при восстановлении продукта');
    }
  }, [restoreProduct]);

  // Подсчёт удалённых продуктов (всегда из всех продуктов, независимо от режима)
  const deletedCount = useMemo(() => {
    return getDeletedSystemProducts().length;
  }, [products]); // Обновляем когда products изменяется (после операций)

  const handleModalSubmit = useCallback(async (productData: Omit<Product, 'id'>, productId?: string) => {
    let success = false;
    
    if (isEditMode && productId) {
      // Режим редактирования
      const result = await updateProduct(productId, productData);
      success = result !== null;
    } else {
      // Режим добавления
      const result = await addProduct(productData);
      success = result !== null;
    }
    
    if (success) {
      closeModal();
    }
  }, [isEditMode, updateProduct, addProduct, closeModal]);

  // Проверяем состояние загрузки после всех хуков
  if (status === 'loading' || productsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Проверяем авторизацию после всех хуков
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

  return (
    <div className="container mx-auto p-4 lg:p-6 pb-20 lg:pb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Продукты</h1>
        </div>
        
        {/* Кнопки управления */}
        <div className="flex items-center space-x-3">
          {/* Переключатель показа удалённых продуктов */}
          <div className="flex items-center space-x-2">
            <label htmlFor="show-deleted" className="flex items-center space-x-2 cursor-pointer">
              <Switch
                id="show-deleted"
                checked={showDeleted}
                onCheckedChange={setShowDeleted}
                className="data-[state=checked]:bg-red-500"
              />
              <span className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Удалённые</span>
                {deletedCount > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                    {deletedCount}
                  </span>
                )}
              </span>
            </label>
          </div>

          {/* Кнопка добавления продукта */}
          <button
            onClick={openAddModal}
            className="flex items-center justify-center sm:justify-start sm:space-x-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            aria-label="Добавить продукт"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline ml-0 sm:ml-0">Добавить</span>
          </button>
          
          {/* Информационная иконка */}
          <div className="relative" ref={infoRef}>
            <button
              onClick={toggleInfo}
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

      {/* Отображение ошибок */}
      {productsError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{productsError}</p>
        </div>
      )}

      {/* Поиск и фильтры */}
      <div className="mb-6 space-y-4">
        {/* Поиск */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск продуктов..."
            value={filters.searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Категории */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filters.selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            Все
          </button>
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filters.selectedCategory === category.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Список продуктов */}
      <div className="grid gap-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {showDeleted ? 'Удалённые продукты не найдены' : 'Продукты не найдены'}
            </p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isExpanded={expandedProductId === product.id}
              onCardClick={handleCardClick}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onReset={handleResetProduct}
              onRestore={handleRestoreProduct}
            />
          ))
        )}
      </div>

      {/* Универсальное модальное окно для продуктов */}
      <ProductModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        product={modalState.editingProduct}
        mode={modalState.mode}
      />

      {/* Модальное окно подтверждения удаления */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        product={deleteModal.product}
      />

      {/* Модальное окно подтверждения сброса */}
      <ResetConfirmModal
        isOpen={resetModal.isOpen}
        onClose={closeResetModal}
        onConfirm={handleConfirmReset}
        product={resetModal.product}
        originalProduct={resetModal.originalProduct || null}
      />
    </div>
  );
}
