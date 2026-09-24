import { combineReducers } from '@reduxjs/toolkit';

import { ingredientsReducer } from './slices';
import { authReducer } from './slices/authSlice';
import { constructorReducer } from './slices/constructorSlice';
import { feedReducer } from './slices/feedSlice';
import { ordersReducer } from './slices/ordersSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  auth: authReducer,
  feed: feedReducer,
  orders: ordersReducer,
});
