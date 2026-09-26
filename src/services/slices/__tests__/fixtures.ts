import type { TConstructorIngredient, TIngredient } from '@utils-types';

const image = 'test-image.png';

export const bun: TIngredient = {
  _id: 'test-bun-001',
  name: 'Тестовая булка',
  type: 'bun',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 200,
  price: 100,
  image,
  image_large: image,
  image_mobile: image,
};

export const filling: TIngredient = {
  _id: 'test-main-001',
  name: 'Тестовая начинка',
  type: 'main',
  proteins: 15,
  fat: 10,
  carbohydrates: 5,
  calories: 150,
  price: 80,
  image,
  image_large: image,
  image_mobile: image,
};

export const sauce: TIngredient = {
  _id: 'test-sauce-001',
  name: 'Тестовый соус',
  type: 'sauce',
  proteins: 1,
  fat: 2,
  carbohydrates: 3,
  calories: 40,
  price: 20,
  image,
  image_large: image,
  image_mobile: image,
};

export const fillingInstance: TConstructorIngredient = {
  ...filling,
  id: 'main-instance-001',
};

export const sauceInstance: TConstructorIngredient = {
  ...sauce,
  id: 'sauce-instance-001',
};
