import { combineReducers } from '@reduxjs/toolkit';

import { ingredientsReducer } from './slices';
import { constructorReducer } from './slices/constructorSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructor: constructorReducer,
});
