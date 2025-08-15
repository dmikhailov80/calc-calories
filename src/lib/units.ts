// Типы единиц измерения
export enum UnitType {
  GRAMS = 'grams',
  PIECES = 'pieces', 
  SPOONS = 'spoons',
  SLICES = 'slices'
}

// Размеры для штучных продуктов
export enum PieceSize {
  SMALL = 'small',
  MEDIUM = 'medium', 
  LARGE = 'large'
}

// Типы ложек
export enum SpoonType {
  TEASPOON = 'teaspoon',
  TABLESPOON = 'tablespoon'
}

// Единица измерения с описанием
export interface MeasurementUnit {
  type: UnitType;
  size?: PieceSize | SpoonType; // для штук - размер, для ложек - тип
  weightInGrams: number; // вес в граммах
  displayName: string; // отображаемое название
}

// Готовые единицы измерения
export const MEASUREMENT_UNITS = {
  // Граммы - базовая единица
  GRAMS_100: {
    type: UnitType.GRAMS,
    weightInGrams: 100,
    displayName: '100г'
  } as MeasurementUnit,

  // Штуки разных размеров
  PIECE_SMALL: {
    type: UnitType.PIECES,
    size: PieceSize.SMALL,
    weightInGrams: 30,
    displayName: '1шт (маленький)'
  } as MeasurementUnit,

  PIECE_MEDIUM: {
    type: UnitType.PIECES,
    size: PieceSize.MEDIUM,
    weightInGrams: 50,
    displayName: '1шт (нормальный)'
  } as MeasurementUnit,

  PIECE_LARGE: {
    type: UnitType.PIECES,
    size: PieceSize.LARGE,
    weightInGrams: 70,
    displayName: '1шт (большой)'
  } as MeasurementUnit,

  // Ложки
  TEASPOON: {
    type: UnitType.SPOONS,
    size: SpoonType.TEASPOON,
    weightInGrams: 5,
    displayName: '1 ч.л.'
  } as MeasurementUnit,

  TABLESPOON: {
    type: UnitType.SPOONS,
    size: SpoonType.TABLESPOON,
    weightInGrams: 15,
    displayName: '1 ст.л.'
  } as MeasurementUnit,

  // Кусочки хлеба
  SLICE_THIN: {
    type: UnitType.SLICES,
    weightInGrams: 20,
    displayName: '1 кусок (тонкий)'
  } as MeasurementUnit,

  SLICE_MEDIUM: {
    type: UnitType.SLICES,
    weightInGrams: 25,
    displayName: '1 кусок (средний)'
  } as MeasurementUnit,

  SLICE_THICK: {
    type: UnitType.SLICES,
    weightInGrams: 30,
    displayName: '1 кусок (толстый)'
  } as MeasurementUnit
} as const;

// Функция для создания пользовательской единицы измерения
export function createCustomUnit(
  type: UnitType,
  weightInGrams: number,
  displayName: string,
  size?: PieceSize | SpoonType
): MeasurementUnit {
  return {
    type,
    weightInGrams,
    displayName,
    ...(size && { size })
  };
}

// Функция для получения единиц измерения по типу
export function getUnitsByType(unitType: UnitType): MeasurementUnit[] {
  return Object.values(MEASUREMENT_UNITS).filter(unit => unit.type === unitType);
}

// Функция для форматирования отображения единицы
export function formatUnitDisplay(unit: MeasurementUnit): string {
  return `${unit.displayName} (${unit.weightInGrams}г)`;
}
