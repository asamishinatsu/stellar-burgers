import {
  addIngredient,
  clearConstructor,
  constructorReducer,
  moveIngredient,
  removeIngredient,
  setBun,
} from '../constructorSlice';
import { bun, filling, sauce } from './fixtures';

describe('Редьюсер burgerConstructor', () => {
  it('возвращает начальное состояние для неизвестного экшена', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  it('обрабатывает setBun', () => {
    const state = { bun: null, ingredients: [filling] };

    expect(constructorReducer(state, setBun(bun))).toEqual({
      bun,
      ingredients: [filling],
    });
  });

  it('обрабатывает addIngredient', () => {
    const state = { bun, ingredients: [filling] };

    expect(constructorReducer(state, addIngredient(sauce))).toEqual({
      bun,
      ingredients: [filling, sauce],
    });
  });

  it('обрабатывает removeIngredient', () => {
    const state = { bun, ingredients: [filling, sauce] };

    expect(constructorReducer(state, removeIngredient(0))).toEqual({
      bun,
      ingredients: [sauce],
    });
  });

  it('обрабатывает moveIngredient', () => {
    const state = { bun, ingredients: [filling, sauce] };

    expect(constructorReducer(state, moveIngredient({ from: 0, to: 1 }))).toEqual({
      bun,
      ingredients: [sauce, filling],
    });
  });

  it('не меняет состояние при неверных индексах moveIngredient', () => {
    const state = { bun, ingredients: [filling, sauce] };

    expect(constructorReducer(state, moveIngredient({ from: -1, to: 1 }))).toEqual(
      state
    );
    expect(constructorReducer(state, moveIngredient({ from: 0, to: 2 }))).toEqual(state);
  });

  it('обрабатывает clearConstructor', () => {
    const state = { bun, ingredients: [filling, sauce] };

    expect(constructorReducer(state, clearConstructor())).toEqual({
      bun: null,
      ingredients: [],
    });
  });
});
