import { fetchIngredients, ingredientsReducer } from '../ingredientsSlice';
import { bun, filling } from './fixtures';

describe('Редьюсер ingredients', () => {
  test('возвращает начальное состояние для неизвестного экшена', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      ingredients: [],
      isLoading: false,
      error: null,
    });
  });

  test('обрабатывает fetchIngredients.pending', () => {
    const state = {
      ingredients: [bun],
      isLoading: false,
      error: { message: 'Прошлая ошибка' },
    };

    expect(
      ingredientsReducer(state, fetchIngredients.pending('request-id', undefined))
    ).toEqual({
      ingredients: [bun],
      isLoading: true,
      error: null,
    });
  });

  test('обрабатывает fetchIngredients.fulfilled', () => {
    const state = {
      ingredients: [bun],
      isLoading: true,
      error: null,
    };

    expect(
      ingredientsReducer(
        state,
        fetchIngredients.fulfilled([filling], 'request-id', undefined)
      )
    ).toEqual({
      ingredients: [filling],
      isLoading: false,
      error: null,
    });
  });

  test('обрабатывает fetchIngredients.rejected', () => {
    const state = {
      ingredients: [bun],
      isLoading: true,
      error: null,
    };
    const action = fetchIngredients.rejected(
      new Error('Не удалось загрузить ингредиенты'),
      'request-id',
      undefined
    );

    expect(ingredientsReducer(state, action)).toEqual({
      ingredients: [bun],
      isLoading: false,
      error: action.error,
    });
  });
});
