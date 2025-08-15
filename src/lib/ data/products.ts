import { Product } from '../products-data';
import { PRODUCT_CATEGORIES } from './categories';
import { MEASUREMENT_UNITS, createCustomUnit, UnitType } from '../units';

export const PRODUCTS_DATABASE: Product[] = [
  // Молочные продукты
  { id: '550e8400-e29b-41d4-a716-446655440001', name: 'Молоко 1%', category: PRODUCT_CATEGORIES.DAIRY.key, calories: 40, protein: 3, fat: 1, carbs: 4, measurementUnits: [] },
  { id: '550e8400-e29b-41d4-a716-446655440002', name: 'Молоко 3,2%', category: PRODUCT_CATEGORIES.DAIRY.key, calories: 59, protein: 2.9, fat: 3.2, carbs: 3.8, measurementUnits: [] },
  { id: '550e8400-e29b-41d4-a716-446655440003', name: 'Молоко козье', category: PRODUCT_CATEGORIES.DAIRY.key, calories: 77, protein: 2.8, fat: 3.2, carbs: 8.6, measurementUnits: [] },
  { id: '550e8400-e29b-41d4-a716-446655440004', name: 'Молоко сгущенное', category: PRODUCT_CATEGORIES.DAIRY.key, calories: 313, protein: 0, fat: 0, carbs: 53.9, measurementUnits: [
    MEASUREMENT_UNITS.TEASPOON,    // 5г
    MEASUREMENT_UNITS.TABLESPOON   // 15г
  ] },
  { id: '550e8400-e29b-41d4-a716-446655440005', name: 'Кефир 2,5%', category: PRODUCT_CATEGORIES.DAIRY.key, calories: 53, protein: 2.9, fat: 2.5, carbs: 4.1 },
  { id: '550e8400-e29b-41d4-a716-446655440006', name: 'Кефир 1,5%', category: PRODUCT_CATEGORIES.DAIRY.key, calories: 57, protein: 4.1, fat: 1.5, carbs: 5.9 },
  { id: '550e8400-e29b-41d4-a716-446655440007', name: 'Ряженка 3,2%', category: PRODUCT_CATEGORIES.DAIRY.key, calories: 68, protein: 5, fat: 3.2, carbs: 3.5 },
  { id: '550e8400-e29b-41d4-a716-446655440008', name: 'Ряженка 6%', category: PRODUCT_CATEGORIES.DAIRY.key, calories: 92, protein: 5, fat: 6, carbs: 3.5 },
  { id: '550e8400-e29b-41d4-a716-446655440009', name: 'Сметана 15%', category: PRODUCT_CATEGORIES.DAIRY.key, calories: 162, protein: 2.6, fat: 15, carbs: 3.6 },
  { id: '550e8400-e29b-41d4-a716-446655440010', name: 'Сметана 25%', category: PRODUCT_CATEGORIES.DAIRY.key, calories: 250, protein: 2.4, fat: 25, carbs: 3.2 },
  { id: '550e8400-e29b-41d4-a716-446655440011', name: 'Творог 9%', category: PRODUCT_CATEGORIES.DAIRY.key, calories: 169, protein: 18, fat: 9, carbs: 3 },
  { id: '550e8400-e29b-41d4-a716-446655440012', name: 'Творог обезжиренный', category: PRODUCT_CATEGORIES.DAIRY.key, calories: 86, protein: 18, fat: 0.6, carbs: 1.5 },
  { id: '550e8400-e29b-41d4-a716-446655440013', name: 'Сыр голландский', category: PRODUCT_CATEGORIES.DAIRY.key, calories: 356, protein: 24.9, fat: 27.4, carbs: 2.2 },
  { id: '550e8400-e29b-41d4-a716-446655440014', name: 'Сыр российский', category: PRODUCT_CATEGORIES.DAIRY.key, calories: 337, protein: 23.2, fat: 29.5, carbs: 0 },

  // Мясо и рыба
  { id: '550e8400-e29b-41d4-a716-446655440015', name: 'Говядина отварная', category: PRODUCT_CATEGORIES.MEAT_FISH.key, calories: 254, protein: 26, fat: 16.8, carbs: 0 },
  { id: '550e8400-e29b-41d4-a716-446655440016', name: 'Свинина отварная', category: PRODUCT_CATEGORIES.MEAT_FISH.key, calories: 351, protein: 22.6, fat: 28.0, carbs: 0 },
  { id: '550e8400-e29b-41d4-a716-446655440017', name: 'Курица отварная', category: PRODUCT_CATEGORIES.MEAT_FISH.key, calories: 137, protein: 25.2, fat: 4.2, carbs: 0.7 },
  { id: '550e8400-e29b-41d4-a716-446655440018', name: 'Куриная грудка', category: PRODUCT_CATEGORIES.MEAT_FISH.key, calories: 113, protein: 23.6, fat: 1.9, carbs: 0.4 },
  { id: '550e8400-e29b-41d4-a716-446655440019', name: 'Индейка', category: PRODUCT_CATEGORIES.MEAT_FISH.key, calories: 197, protein: 21.6, fat: 12.0, carbs: 0.8 },
  { id: '550e8400-e29b-41d4-a716-446655440020', name: 'Треска', category: PRODUCT_CATEGORIES.MEAT_FISH.key, calories: 75, protein: 17.5, fat: 0.6, carbs: 0 },
  { id: '550e8400-e29b-41d4-a716-446655440021', name: 'Лосось', category: PRODUCT_CATEGORIES.MEAT_FISH.key, calories: 142, protein: 19.8, fat: 6.3, carbs: 0 },
  { id: '550e8400-e29b-41d4-a716-446655440022', name: 'Тунец', category: PRODUCT_CATEGORIES.MEAT_FISH.key, calories: 96, protein: 23.0, fat: 1.0, carbs: 0 },
  { id: '550e8400-e29b-41d4-a716-446655440023', name: 'Скумбрия', category: PRODUCT_CATEGORIES.MEAT_FISH.key, calories: 191, protein: 18.0, fat: 13.2, carbs: 0 },
  { id: '550e8400-e29b-41d4-a716-446655440024', name: 'Креветки', category: PRODUCT_CATEGORIES.MEAT_FISH.key, calories: 95, protein: 18.9, fat: 2.2, carbs: 0 },
  { id: '550e8400-e29b-41d4-a716-446655440025', name: 'Яйцо куриное', category: PRODUCT_CATEGORIES.MEAT_FISH.key, calories: 155, protein: 12.7, fat: 11.5, carbs: 0.7, measurementUnits: [
    MEASUREMENT_UNITS.PIECE_SMALL, // 30г
    MEASUREMENT_UNITS.PIECE_MEDIUM, // 50г
    MEASUREMENT_UNITS.PIECE_LARGE   // 70г
  ] },

  // Крупы, хлеб, мука
  { id: '550e8400-e29b-41d4-a716-446655440026', name: 'Хлеб ржаной', category: PRODUCT_CATEGORIES.CEREALS.key, calories: 210, protein: 6.6, fat: 1.2, carbs: 43.0, measurementUnits: [
    MEASUREMENT_UNITS.SLICE_THIN,   // 20г
    MEASUREMENT_UNITS.SLICE_MEDIUM, // 25г
    MEASUREMENT_UNITS.SLICE_THICK   // 30г
  ] },
  { id: '550e8400-e29b-41d4-a716-446655440027', name: 'Хлеб белый', category: PRODUCT_CATEGORIES.CEREALS.key, calories: 266, protein: 8.1, fat: 3.2, carbs: 50.0, measurementUnits: [
    MEASUREMENT_UNITS.SLICE_THIN,   // 20г
    MEASUREMENT_UNITS.SLICE_MEDIUM, // 25г
    MEASUREMENT_UNITS.SLICE_THICK   // 30г
  ] },
  { id: '550e8400-e29b-41d4-a716-446655440028', name: 'Рис отварной', category: PRODUCT_CATEGORIES.CEREALS.key, calories: 116, protein: 2.2, fat: 0.5, carbs: 24.9 },
  { id: '550e8400-e29b-41d4-a716-446655440029', name: 'Гречка отварная', category: PRODUCT_CATEGORIES.CEREALS.key, calories: 132, protein: 4.5, fat: 2.3, carbs: 21.6 },
  { id: '550e8400-e29b-41d4-a716-446655440030', name: 'Овсянка на воде', category: PRODUCT_CATEGORIES.CEREALS.key, calories: 88, protein: 3.0, fat: 1.7, carbs: 15.0 },
  { id: '550e8400-e29b-41d4-a716-446655440031', name: 'Макароны отварные', category: PRODUCT_CATEGORIES.CEREALS.key, calories: 113, protein: 3.5, fat: 0.4, carbs: 23.2 },
  { id: '550e8400-e29b-41d4-a716-446655440032', name: 'Мука пшеничная', category: PRODUCT_CATEGORIES.CEREALS.key, calories: 342, protein: 12.6, fat: 1.1, carbs: 66.9 },

  // Овощи и зелень
  { id: '550e8400-e29b-41d4-a716-446655440033', name: 'Картофель отварной', category: PRODUCT_CATEGORIES.VEGETABLES.key, calories: 82, protein: 2.0, fat: 0.4, carbs: 16.7 },
  { id: '550e8400-e29b-41d4-a716-446655440034', name: 'Морковь', category: PRODUCT_CATEGORIES.VEGETABLES.key, calories: 35, protein: 1.3, fat: 0.1, carbs: 6.9 },
  { id: '550e8400-e29b-41d4-a716-446655440035', name: 'Свёкла', category: PRODUCT_CATEGORIES.VEGETABLES.key, calories: 40, protein: 1.5, fat: 0.1, carbs: 8.8 },
  { id: '550e8400-e29b-41d4-a716-446655440036', name: 'Капуста белокочанная', category: PRODUCT_CATEGORIES.VEGETABLES.key, calories: 27, protein: 1.8, fat: 0.1, carbs: 4.7 },
  { id: '550e8400-e29b-41d4-a716-446655440037', name: 'Капуста цветная', category: PRODUCT_CATEGORIES.VEGETABLES.key, calories: 30, protein: 2.5, fat: 0.3, carbs: 4.2 },
  { id: '550e8400-e29b-41d4-a716-446655440038', name: 'Помидоры', category: PRODUCT_CATEGORIES.VEGETABLES.key, calories: 20, protein: 1.1, fat: 0.2, carbs: 3.8 },
  { id: '550e8400-e29b-41d4-a716-446655440039', name: 'Огурцы', category: PRODUCT_CATEGORIES.VEGETABLES.key, calories: 15, protein: 0.8, fat: 0.1, carbs: 2.8 },
  { id: '550e8400-e29b-41d4-a716-446655440040', name: 'Перец болгарский', category: PRODUCT_CATEGORIES.VEGETABLES.key, calories: 27, protein: 1.3, fat: 0.1, carbs: 5.3 },
  { id: '550e8400-e29b-41d4-a716-446655440041', name: 'Лук репчатый', category: PRODUCT_CATEGORIES.VEGETABLES.key, calories: 41, protein: 1.4, fat: 0.2, carbs: 8.2 },
  { id: '550e8400-e29b-41d4-a716-446655440042', name: 'Чеснок', category: PRODUCT_CATEGORIES.VEGETABLES.key, calories: 143, protein: 6.5, fat: 0.5, carbs: 29.9 },
  { id: '550e8400-e29b-41d4-a716-446655440043', name: 'Укроп', category: PRODUCT_CATEGORIES.VEGETABLES.key, calories: 38, protein: 2.5, fat: 0.5, carbs: 6.3 },
  { id: '550e8400-e29b-41d4-a716-446655440044', name: 'Петрушка', category: PRODUCT_CATEGORIES.VEGETABLES.key, calories: 47, protein: 3.7, fat: 0.4, carbs: 7.6 },
  { id: '550e8400-e29b-41d4-a716-446655440045', name: 'Салат', category: PRODUCT_CATEGORIES.VEGETABLES.key, calories: 12, protein: 1.2, fat: 0.3, carbs: 1.3 },

  // Фрукты и ягоды
  { id: '550e8400-e29b-41d4-a716-446655440046', name: 'Яблоки', category: PRODUCT_CATEGORIES.FRUITS.key, calories: 47, protein: 0.4, fat: 0.4, carbs: 9.8, measurementUnits: [
    createCustomUnit(UnitType.PIECES, 120, '1шт (маленькое)', undefined),
    createCustomUnit(UnitType.PIECES, 180, '1шт (среднее)', undefined),
    createCustomUnit(UnitType.PIECES, 250, '1шт (большое)', undefined)
  ] },
  { id: '550e8400-e29b-41d4-a716-446655440047', name: 'Груши', category: PRODUCT_CATEGORIES.FRUITS.key, calories: 42, protein: 0.4, fat: 0.3, carbs: 10.3 },
  { id: '550e8400-e29b-41d4-a716-446655440048', name: 'Бананы', category: PRODUCT_CATEGORIES.FRUITS.key, calories: 95, protein: 1.5, fat: 0.2, carbs: 21.8 },
  { id: '550e8400-e29b-41d4-a716-446655440049', name: 'Апельсины', category: PRODUCT_CATEGORIES.FRUITS.key, calories: 43, protein: 0.9, fat: 0.2, carbs: 8.1 },
  { id: '550e8400-e29b-41d4-a716-446655440050', name: 'Мандарины', category: PRODUCT_CATEGORIES.FRUITS.key, calories: 33, protein: 0.8, fat: 0.2, carbs: 7.5 },
  { id: '550e8400-e29b-41d4-a716-446655440051', name: 'Лимоны', category: PRODUCT_CATEGORIES.FRUITS.key, calories: 16, protein: 0.9, fat: 0.1, carbs: 3.0 },
  { id: '550e8400-e29b-41d4-a716-446655440052', name: 'Виноград', category: PRODUCT_CATEGORIES.FRUITS.key, calories: 65, protein: 0.6, fat: 0.2, carbs: 16.8 },
  { id: '550e8400-e29b-41d4-a716-446655440053', name: 'Клубника', category: PRODUCT_CATEGORIES.FRUITS.key, calories: 41, protein: 0.8, fat: 0.4, carbs: 7.5 },
  { id: '550e8400-e29b-41d4-a716-446655440054', name: 'Малина', category: PRODUCT_CATEGORIES.FRUITS.key, calories: 46, protein: 0.8, fat: 0.5, carbs: 8.3 },
  { id: '550e8400-e29b-41d4-a716-446655440055', name: 'Черника', category: PRODUCT_CATEGORIES.FRUITS.key, calories: 44, protein: 1.1, fat: 0.4, carbs: 7.6 },

  // Орехи и семена
  { id: '550e8400-e29b-41d4-a716-446655440056', name: 'Грецкие орехи', category: PRODUCT_CATEGORIES.NUTS_SEEDS.key, calories: 654, protein: 15.2, fat: 65.2, carbs: 7.0 },
  { id: '550e8400-e29b-41d4-a716-446655440057', name: 'Миндаль', category: PRODUCT_CATEGORIES.NUTS_SEEDS.key, calories: 579, protein: 18.6, fat: 53.7, carbs: 13.0 },
  { id: '550e8400-e29b-41d4-a716-446655440058', name: 'Семена подсолнечника', category: PRODUCT_CATEGORIES.NUTS_SEEDS.key, calories: 601, protein: 20.7, fat: 52.9, carbs: 10.5 },
  { id: '550e8400-e29b-41d4-a716-446655440059', name: 'Тыквенные семечки', category: PRODUCT_CATEGORIES.NUTS_SEEDS.key, calories: 559, protein: 30.2, fat: 49.0, carbs: 10.7 },

  // Жиры и масла
  { id: '550e8400-e29b-41d4-a716-446655440060', name: 'Масло подсолнечное', category: PRODUCT_CATEGORIES.FATS_OILS.key, calories: 899, protein: 0, fat: 99.9, carbs: 0, measurementUnits: [
    MEASUREMENT_UNITS.TEASPOON,    // 5г
    MEASUREMENT_UNITS.TABLESPOON   // 15г
  ] },
  { id: '550e8400-e29b-41d4-a716-446655440061', name: 'Масло оливковое', category: PRODUCT_CATEGORIES.FATS_OILS.key, calories: 898, protein: 0, fat: 99.8, carbs: 0 },
  { id: '550e8400-e29b-41d4-a716-446655440062', name: 'Масло сливочное', category: PRODUCT_CATEGORIES.FATS_OILS.key, calories: 717, protein: 0.5, fat: 78.0, carbs: 0.8, measurementUnits: [] },
].map(product => ({
  ...product,
  // Если у продукта нет единиц измерения, добавляем пустой массив (граммы добавляются автоматически при отображении)
  measurementUnits: product.measurementUnits || []
}));
