import { addIngredient, setBun } from '@/services/slices/constructorSlice';
import { nanoid } from '@reduxjs/toolkit';
import { BurgerIngredientUI } from '@ui';
import { memo } from 'react';
import { useLocation } from 'react-router-dom';

import { useDispatch } from '@services/store';

import type { TBurgerIngredientProps } from './type';

export const BurgerIngredient = memo(function BurgerIngredient({
  ingredient,
  count,
}: TBurgerIngredientProps): React.JSX.Element {
  const dispatch = useDispatch();
  const location = useLocation();

  const handleAdd = (): void => {
    const item = { ...ingredient, id: nanoid() };
    if (ingredient.type === 'bun') {
      dispatch(setBun(item));
    } else {
      dispatch(addIngredient(item));
    }
  };

  return (
    <BurgerIngredientUI
      ingredient={ingredient}
      count={count}
      locationState={{ background: location }}
      handleAdd={handleAdd}
    />
  );
});
