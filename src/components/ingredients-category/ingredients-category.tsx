import { BUN_COUNT } from '@/utils/constants';
import { selectBurgerConstructor } from '@selectors';
import { IngredientsCategoryUI } from '@ui';
import { useMemo } from 'react';

import { useSelector } from '@services/store';

import type { TIngredientsCategoryProps } from './type';
import type { TIngredient } from '@utils-types';

export const IngredientsCategory = ({
  title,
  titleRef,
  ingredients,
  ref,
}: TIngredientsCategoryProps): React.JSX.Element => {
  const burgerConstructor = useSelector(selectBurgerConstructor);

  const ingredientsCounters = useMemo(() => {
    const { bun, ingredients } = burgerConstructor;
    const counters: Record<string, number> = {};
    ingredients.forEach((ingredient: TIngredient) => {
      counters[ingredient._id] = (counters[ingredient._id] ?? 0) + 1;
    });
    if (bun) counters[bun._id] = BUN_COUNT;
    return counters;
  }, [burgerConstructor]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
};
