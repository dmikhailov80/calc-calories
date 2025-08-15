// Экспорт всех custom hooks для удобства импорта

export { useProducts } from './useProducts';
export { useProductFilters } from './useProductFilters';
export { useProductModal } from './useProductModal';
export { useConfirmModal } from './useConfirmModal';
export { useInfoTooltip } from './useInfoTooltip';
export { useProductForm } from './useProductForm';
export { useProductSearch, clearSearchCache } from './useProductSearch';
export { useDebounced, useDebouncedSearch, useDebouncedWithForce } from './useDebounced';

export type { UseProductsReturn } from './useProducts';
export type { UseProductFiltersReturn, ProductFilters } from './useProductFilters';
export type { UseProductModalReturn, ProductModalState } from './useProductModal';
export type { UseConfirmModalReturn, ConfirmModalState } from './useConfirmModal';
export type { UseInfoTooltipReturn } from './useInfoTooltip';
export type { UseProductFormReturn, ProductFormState, FormErrors } from './useProductForm';
