import {
  addIngredient,
  clearConstructor,
  constructorReducer,
  moveIngredient,
  removeIngredient,
  setBun,
} from '../constructorSlice';
import { bun, fillingInstance, sauce, sauceInstance } from './fixtures';

describe('Редьюсер burgerConstructor', () => {
  test('возвращает начальное состояние для неизвестного экшена', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  test('обрабатывает setBun без добавления id к булке', () => {
    const state = { bun: null, ingredients: [fillingInstance] };

    expect(constructorReducer(state, setBun(bun))).toEqual({
      bun,
      ingredients: [fillingInstance],
    });
  });

  test('добавляет начинку и создаёт для неё id через prepare', () => {
    const state = { bun, ingredients: [fillingInstance] };
    const action = addIngredient(sauce);

    expect(action.payload).toMatchObject(sauce);
    expect(typeof action.payload.id).toBe('string');
    expect(action.payload.id).not.toHaveLength(0);
    expect(constructorReducer(state, action)).toEqual({
      bun,
      ingredients: [fillingInstance, action.payload],
    });
  });

  test('обрабатывает removeIngredient', () => {
    const state = { bun, ingredients: [fillingInstance, sauceInstance] };

    expect(constructorReducer(state, removeIngredient(0))).toEqual({
      bun,
      ingredients: [sauceInstance],
    });
  });

  test('обрабатывает moveIngredient', () => {
    const state = { bun, ingredients: [fillingInstance, sauceInstance] };

    expect(constructorReducer(state, moveIngredient({ from: 0, to: 1 }))).toEqual({
      bun,
      ingredients: [sauceInstance, fillingInstance],
    });
  });

  test('не меняет состояние при неверных индексах moveIngredient', () => {
    const state = { bun, ingredients: [fillingInstance, sauceInstance] };

    expect(constructorReducer(state, moveIngredient({ from: -1, to: 1 }))).toEqual(
      state
    );
    expect(constructorReducer(state, moveIngredient({ from: 0, to: 2 }))).toEqual(state);
  });

  test('обрабатывает clearConstructor', () => {
    const state = { bun, ingredients: [fillingInstance, sauceInstance] };

    expect(constructorReducer(state, clearConstructor())).toEqual({
      bun: null,
      ingredients: [],
    });
  });
});
