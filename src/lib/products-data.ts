export interface Product {
  id: string;
  name: string;
  category: string;
  calories: number; // kcal per 100g
  protein: number;  // g per 100g
  fat: number;      // g per 100g
  carbs: number;    // g per 100g
}

export const PRODUCT_CATEGORIES = {
  DAIRY: 'Молочные продукты',
  MEAT_FISH: 'Мясо и рыба',
  CEREALS: 'Крупы, хлеб, мука',
  VEGETABLES: 'Овощи и зелень',
  FRUITS: 'Фрукты и ягоды',
  NUTS_SEEDS: 'Орехи и семена',
  FATS_OILS: 'Жиры и масла'
} as const;

export const PRODUCTS_DATA: Product[] = [
  // Молочные продукты
  { id: '1', name: 'Молоко 1%', category: PRODUCT_CATEGORIES.DAIRY, calories: 40, protein: 3, fat: 1, carbs: 4 },
  { id: '2', name: 'Молоко 3,2%', category: PRODUCT_CATEGORIES.DAIRY, calories: 59, protein: 2.9, fat: 3.2, carbs: 3.8 },
  { id: '3', name: 'Молоко козье', category: PRODUCT_CATEGORIES.DAIRY, calories: 77, protein: 2.8, fat: 3.2, carbs: 8.6 },
  { id: '4', name: 'Молоко сгущенное', category: PRODUCT_CATEGORIES.DAIRY, calories: 313, protein: 0, fat: 0, carbs: 53.9 },
  { id: '5', name: 'Кефир 2,5%', category: PRODUCT_CATEGORIES.DAIRY, calories: 53, protein: 2.9, fat: 2.5, carbs: 4.1 },
  { id: '6', name: 'Кефир 1,5%', category: PRODUCT_CATEGORIES.DAIRY, calories: 57, protein: 4.1, fat: 1.5, carbs: 5.9 },
  { id: '7', name: 'Ряженка 3,2%', category: PRODUCT_CATEGORIES.DAIRY, calories: 68, protein: 5, fat: 3.2, carbs: 3.5 },
  { id: '8', name: 'Ряженка 6%', category: PRODUCT_CATEGORIES.DAIRY, calories: 92, protein: 5, fat: 6, carbs: 3.5 },
  { id: '9', name: 'Сметана 15%', category: PRODUCT_CATEGORIES.DAIRY, calories: 162, protein: 2.6, fat: 15, carbs: 3.6 },
  { id: '10', name: 'Сметана 25%', category: PRODUCT_CATEGORIES.DAIRY, calories: 250, protein: 2.4, fat: 25, carbs: 3.2 },
  { id: '11', name: 'Творог 9%', category: PRODUCT_CATEGORIES.DAIRY, calories: 169, protein: 18, fat: 9, carbs: 3 },
  { id: '12', name: 'Творог обезжиренный', category: PRODUCT_CATEGORIES.DAIRY, calories: 86, protein: 18, fat: 0.6, carbs: 1.5 },
  { id: '13', name: 'Сыр голландский', category: PRODUCT_CATEGORIES.DAIRY, calories: 356, protein: 24.9, fat: 27.4, carbs: 2.2 },
  { id: '14', name: 'Сыр российский', category: PRODUCT_CATEGORIES.DAIRY, calories: 337, protein: 23.2, fat: 29.5, carbs: 0 },

  // Мясо и рыба
  { id: '15', name: 'Говядина отварная', category: PRODUCT_CATEGORIES.MEAT_FISH, calories: 254, protein: 26, fat: 16.8, carbs: 0 },
  { id: '16', name: 'Свинина отварная', category: PRODUCT_CATEGORIES.MEAT_FISH, calories: 351, protein: 22.6, fat: 28.0, carbs: 0 },
  { id: '17', name: 'Курица отварная', category: PRODUCT_CATEGORIES.MEAT_FISH, calories: 137, protein: 25.2, fat: 4.2, carbs: 0.7 },
  { id: '18', name: 'Куриная грудка', category: PRODUCT_CATEGORIES.MEAT_FISH, calories: 113, protein: 23.6, fat: 1.9, carbs: 0.4 },
  { id: '19', name: 'Индейка', category: PRODUCT_CATEGORIES.MEAT_FISH, calories: 197, protein: 21.6, fat: 12.0, carbs: 0.8 },
  { id: '20', name: 'Треска', category: PRODUCT_CATEGORIES.MEAT_FISH, calories: 75, protein: 17.5, fat: 0.6, carbs: 0 },
  { id: '21', name: 'Лосось', category: PRODUCT_CATEGORIES.MEAT_FISH, calories: 142, protein: 19.8, fat: 6.3, carbs: 0 },
  { id: '22', name: 'Тунец', category: PRODUCT_CATEGORIES.MEAT_FISH, calories: 96, protein: 23.0, fat: 1.0, carbs: 0 },
  { id: '23', name: 'Скумбрия', category: PRODUCT_CATEGORIES.MEAT_FISH, calories: 191, protein: 18.0, fat: 13.2, carbs: 0 },
  { id: '24', name: 'Креветки', category: PRODUCT_CATEGORIES.MEAT_FISH, calories: 95, protein: 18.9, fat: 2.2, carbs: 0 },
  { id: '25', name: 'Яйцо куриное', category: PRODUCT_CATEGORIES.MEAT_FISH, calories: 155, protein: 12.7, fat: 11.5, carbs: 0.7 },

  // Крупы, хлеб, мука
  { id: '26', name: 'Хлеб ржаной', category: PRODUCT_CATEGORIES.CEREALS, calories: 210, protein: 6.6, fat: 1.2, carbs: 43.0 },
  { id: '27', name: 'Хлеб белый', category: PRODUCT_CATEGORIES.CEREALS, calories: 266, protein: 8.1, fat: 3.2, carbs: 50.0 },
  { id: '28', name: 'Рис отварной', category: PRODUCT_CATEGORIES.CEREALS, calories: 116, protein: 2.2, fat: 0.5, carbs: 24.9 },
  { id: '29', name: 'Гречка отварная', category: PRODUCT_CATEGORIES.CEREALS, calories: 132, protein: 4.5, fat: 2.3, carbs: 21.6 },
  { id: '30', name: 'Овсянка на воде', category: PRODUCT_CATEGORIES.CEREALS, calories: 88, protein: 3.0, fat: 1.7, carbs: 15.0 },
  { id: '31', name: 'Макароны отварные', category: PRODUCT_CATEGORIES.CEREALS, calories: 113, protein: 3.5, fat: 0.4, carbs: 23.2 },
  { id: '32', name: 'Мука пшеничная', category: PRODUCT_CATEGORIES.CEREALS, calories: 342, protein: 12.6, fat: 1.1, carbs: 66.9 },

  // Овощи и зелень
  { id: '33', name: 'Картофель отварной', category: PRODUCT_CATEGORIES.VEGETABLES, calories: 82, protein: 2.0, fat: 0.4, carbs: 16.7 },
  { id: '34', name: 'Морковь', category: PRODUCT_CATEGORIES.VEGETABLES, calories: 35, protein: 1.3, fat: 0.1, carbs: 6.9 },
  { id: '35', name: 'Свёкла', category: PRODUCT_CATEGORIES.VEGETABLES, calories: 40, protein: 1.5, fat: 0.1, carbs: 8.8 },
  { id: '36', name: 'Капуста белокочанная', category: PRODUCT_CATEGORIES.VEGETABLES, calories: 27, protein: 1.8, fat: 0.1, carbs: 4.7 },
  { id: '37', name: 'Капуста цветная', category: PRODUCT_CATEGORIES.VEGETABLES, calories: 30, protein: 2.5, fat: 0.3, carbs: 4.2 },
  { id: '38', name: 'Помидоры', category: PRODUCT_CATEGORIES.VEGETABLES, calories: 20, protein: 1.1, fat: 0.2, carbs: 3.8 },
  { id: '39', name: 'Огурцы', category: PRODUCT_CATEGORIES.VEGETABLES, calories: 15, protein: 0.8, fat: 0.1, carbs: 2.8 },
  { id: '40', name: 'Перец болгарский', category: PRODUCT_CATEGORIES.VEGETABLES, calories: 27, protein: 1.3, fat: 0.1, carbs: 5.3 },
  { id: '41', name: 'Лук репчатый', category: PRODUCT_CATEGORIES.VEGETABLES, calories: 41, protein: 1.4, fat: 0.2, carbs: 8.2 },
  { id: '42', name: 'Чеснок', category: PRODUCT_CATEGORIES.VEGETABLES, calories: 143, protein: 6.5, fat: 0.5, carbs: 29.9 },
  { id: '43', name: 'Укроп', category: PRODUCT_CATEGORIES.VEGETABLES, calories: 38, protein: 2.5, fat: 0.5, carbs: 6.3 },
  { id: '44', name: 'Петрушка', category: PRODUCT_CATEGORIES.VEGETABLES, calories: 47, protein: 3.7, fat: 0.4, carbs: 7.6 },
  { id: '45', name: 'Салат', category: PRODUCT_CATEGORIES.VEGETABLES, calories: 12, protein: 1.2, fat: 0.3, carbs: 1.3 },

  // Фрукты и ягоды
  { id: '46', name: 'Яблоки', category: PRODUCT_CATEGORIES.FRUITS, calories: 47, protein: 0.4, fat: 0.4, carbs: 9.8 },
  { id: '47', name: 'Груши', category: PRODUCT_CATEGORIES.FRUITS, calories: 42, protein: 0.4, fat: 0.3, carbs: 10.3 },
  { id: '48', name: 'Бананы', category: PRODUCT_CATEGORIES.FRUITS, calories: 95, protein: 1.5, fat: 0.2, carbs: 21.8 },
  { id: '49', name: 'Апельсины', category: PRODUCT_CATEGORIES.FRUITS, calories: 43, protein: 0.9, fat: 0.2, carbs: 8.1 },
  { id: '50', name: 'Мандарины', category: PRODUCT_CATEGORIES.FRUITS, calories: 33, protein: 0.8, fat: 0.2, carbs: 7.5 },
  { id: '51', name: 'Лимоны', category: PRODUCT_CATEGORIES.FRUITS, calories: 16, protein: 0.9, fat: 0.1, carbs: 3.0 },
  { id: '52', name: 'Виноград', category: PRODUCT_CATEGORIES.FRUITS, calories: 65, protein: 0.6, fat: 0.2, carbs: 16.8 },
  { id: '53', name: 'Клубника', category: PRODUCT_CATEGORIES.FRUITS, calories: 41, protein: 0.8, fat: 0.4, carbs: 7.5 },
  { id: '54', name: 'Малина', category: PRODUCT_CATEGORIES.FRUITS, calories: 46, protein: 0.8, fat: 0.5, carbs: 8.3 },
  { id: '55', name: 'Черника', category: PRODUCT_CATEGORIES.FRUITS, calories: 44, protein: 1.1, fat: 0.4, carbs: 7.6 },

  // Орехи и семена
  { id: '56', name: 'Грецкие орехи', category: PRODUCT_CATEGORIES.NUTS_SEEDS, calories: 654, protein: 15.2, fat: 65.2, carbs: 7.0 },
  { id: '57', name: 'Миндаль', category: PRODUCT_CATEGORIES.NUTS_SEEDS, calories: 579, protein: 18.6, fat: 53.7, carbs: 13.0 },
  { id: '58', name: 'Семена подсолнечника', category: PRODUCT_CATEGORIES.NUTS_SEEDS, calories: 601, protein: 20.7, fat: 52.9, carbs: 10.5 },
  { id: '59', name: 'Тыквенные семечки', category: PRODUCT_CATEGORIES.NUTS_SEEDS, calories: 559, protein: 30.2, fat: 49.0, carbs: 10.7 },

  // Жиры и масла
  { id: '60', name: 'Масло подсолнечное', category: PRODUCT_CATEGORIES.FATS_OILS, calories: 899, protein: 0, fat: 99.9, carbs: 0 },
  { id: '61', name: 'Масло оливковое', category: PRODUCT_CATEGORIES.FATS_OILS, calories: 898, protein: 0, fat: 99.8, carbs: 0 },
  { id: '62', name: 'Масло сливочное', category: PRODUCT_CATEGORIES.FATS_OILS, calories: 717, protein: 0.5, fat: 78.0, carbs: 0.8 },
];

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS_DATA.filter(product => product.category === category);
}

export function getAllCategories(): string[] {
  return Object.values(PRODUCT_CATEGORIES);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS_DATA.find(product => product.id === id);
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase();
  return PRODUCTS_DATA.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery)
  );
}
