import type { RootState } from '../store';

export const selectIngredients = (
  state: RootState
): RootState['ingredients']['ingredients'] => state.ingredients.ingredients;
export const selectIngredientsLoading = (state: RootState): boolean =>
  state.ingredients.isLoading;
export const selectIngredientsError = (
  state: RootState
): RootState['ingredients']['error'] => state.ingredients.error;
export const selectBurgerConstructor = (
  state: RootState
): RootState['burgerConstructor'] => state.burgerConstructor;
export const selectUser = (state: RootState): RootState['auth']['user'] =>
  state.auth.user;
export const selectUserName = (state: RootState): string | undefined =>
  state.auth.user?.name;
export const selectAuthChecked = (state: RootState): boolean => state.auth.isAuthChecked;
export const selectFeed = (state: RootState): RootState['feed'] => state.feed;
export const selectOrders = (state: RootState): RootState['orders'] => state.orders;
