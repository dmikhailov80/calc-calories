export interface ProductCategory {
  name: string;
  key: string;
}

export const PRODUCT_CATEGORIES: Record<string, ProductCategory> = {
  UNCATEGORIZED: {
    name: 'Без категории',
    key: 'UNCATEGORIZED'
  },
  DAIRY: {
    name: 'Молочные продукты',
    key: 'DAIRY'
  },
  MEAT_FISH: {
    name: 'Мясо и рыба',
    key: 'MEAT_FISH'
  },
  CEREALS: {
    name: 'Крупы, хлеб, мука',
    key: 'CEREALS'
  },
  VEGETABLES: {
    name: 'Овощи и зелень',
    key: 'VEGETABLES'
  },
  FRUITS: {
    name: 'Фрукты и ягоды',
    key: 'FRUITS'
  },
  NUTS_SEEDS: {
    name: 'Орехи и семена',
    key: 'NUTS_SEEDS'
  },
  FATS_OILS: {
    name: 'Жиры и масла',
    key: 'FATS_OILS'
  }
} as const;

export function getCategoryByKey(key: string): ProductCategory | undefined {
  return PRODUCT_CATEGORIES[key];
}

export function getAllCategories(): ProductCategory[] {
  return Object.values(PRODUCT_CATEGORIES);
}

export function getCategoryNames(): string[] {
  return Object.values(PRODUCT_CATEGORIES).map(category => category.name);
}
