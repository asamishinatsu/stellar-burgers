import type { TConstructorIngredient } from '@utils-types';

const image = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

export const bun: TConstructorIngredient = {
  _id: 'test-bun-001',
  id: 'bun-instance-001',
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

export const filling: TConstructorIngredient = {
  _id: 'test-main-001',
  id: 'main-instance-001',
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

export const sauce: TConstructorIngredient = {
  _id: 'test-sauce-001',
  id: 'sauce-instance-001',
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
