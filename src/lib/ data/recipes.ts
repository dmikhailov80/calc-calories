import { Recipe } from '../recipes-data';
import { UnitType, MEASUREMENT_UNITS } from '../units';

// Системные рецепты
export const RECIPES_DATABASE: Recipe[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Суп-пюре из кабачка',
    description: 'Нежный суп-пюре из кабачков со сливками',
    ingredients: [
      {
        productId: '550e8400-e29b-41d4-a716-446655440060', // Масло подсолнечное
        amount: 6,
        unit: MEASUREMENT_UNITS.GRAMS_100
      },
      {
        productId: '550e8400-e29b-41d4-a716-446655440062', // Масло сливочное
        amount: 13,
        unit: MEASUREMENT_UNITS.GRAMS_100
      },
      {
        productId: '550e8400-e29b-41d4-a716-446655440041', // Лук репчатый
        amount: 34,
        unit: MEASUREMENT_UNITS.GRAMS_100
      },
      {
        productId: '550e8400-e29b-41d4-a716-446655440042', // Чеснок
        amount: 6,
        unit: MEASUREMENT_UNITS.GRAMS_100
      },
      {
        productId: '550e8400-e29b-41d4-a716-446655440033', // Картофель отварной
        amount: 97,
        unit: MEASUREMENT_UNITS.GRAMS_100
      },
      {
        productId: '550e8400-e29b-41d4-a716-446655440063', // Кабачки
        amount: 461,
        unit: MEASUREMENT_UNITS.GRAMS_100
      },
      {
        productId: '550e8400-e29b-41d4-a716-446655440064', // Сливки 33%
        amount: 45,
        unit: MEASUREMENT_UNITS.GRAMS_100
      }
    ]
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Бутерброды с печенью трески x2',
    description: 'Питательные бутерброды с печенью трески и яйцом',
    ingredients: [
      {
        productId: '550e8400-e29b-41d4-a716-446655440066', // Хлебцы цельнозерновые
        amount: 2,
        unit: { type: UnitType.PIECES, weightInGrams: 8, displayName: '1 шт' }
      },
      {
        productId: '550e8400-e29b-41d4-a716-446655440065', // Печень трески
        amount: 40,
        unit: MEASUREMENT_UNITS.GRAMS_100
      },
      {
        productId: '550e8400-e29b-41d4-a716-446655440025', // Яйцо куриное
        amount: 1,
        unit: MEASUREMENT_UNITS.PIECE_MEDIUM
      },
      {
        productId: '550e8400-e29b-41d4-a716-446655440067', // Огурцы свежие
        amount: 40,
        unit: MEASUREMENT_UNITS.GRAMS_100
      },
      {
        productId: '550e8400-e29b-41d4-a716-446655440068', // Лук зеленый
        amount: 10,
        unit: MEASUREMENT_UNITS.GRAMS_100
      }
    ]
  }
];