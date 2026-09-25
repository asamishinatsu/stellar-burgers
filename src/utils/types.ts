import type { SerializedError } from '@reduxjs/toolkit';

export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};

export type TConstructorIngredient = TIngredient & {
  id: string;
};

export type TOrder = {
  _id: string;
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  ingredients: string[];
};

export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TUser = {
  email: string;
  name: string;
};

export type TProfileForm = TUser & { password: string };

export type TTabMode = 'bun' | 'sauce' | 'main';

export type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: SerializedError | null;
};

export type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

export type TFeedState = TOrdersData & {
  isLoading: boolean;
  error: SerializedError | null;
};

export type TOrdersState = {
  userOrders: TOrder[];
  selectedOrder: TOrder | null;
  orderModalData: TOrder | null;
  isUserOrdersLoading: boolean;
  isOrderDetailsLoading: boolean;
  isOrderCreating: boolean;
  userOrdersError: SerializedError | null;
  orderDetailsError: SerializedError | null;
  orderCreateError: SerializedError | null;
  userOrdersRequestId: string | null;
  orderDetailsRequestId: string | null;
  orderCreateRequestId: string | null;
};
