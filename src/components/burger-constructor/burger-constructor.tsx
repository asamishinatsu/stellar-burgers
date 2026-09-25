import { clearConstructor } from '@/services/slices/constructorSlice';
import { BUN_COUNT } from '@/utils/constants';
import { selectBurgerConstructor, selectOrders, selectUser } from '@selectors';
import { clearOrderModal, createOrder, fetchFeeds } from '@slices';
import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const constructorItems = useSelector(selectBurgerConstructor);
  const user = useSelector(selectUser);
  const { isOrderCreating, orderModalData, orderCreateError } =
    useSelector(selectOrders);

  const onOrderClick = (): void => {
    if (isOrderCreating) return;
    if (!user) {
      void navigate('/login', { state: { from: location } });
      return;
    }
    if (!constructorItems.bun) return;

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id,
    ];
    void dispatch(createOrder(ingredientIds)).then((action): void => {
      if (!createOrder.fulfilled.match(action)) return;
      dispatch(clearConstructor());
      void dispatch(fetchFeeds());
    });
  };

  const closeOrderModal = (): void => {
    dispatch(clearOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * BUN_COUNT : 0) +
      constructorItems.ingredients.reduce(
        (sum: number, ingredient: TConstructorIngredient) => sum + ingredient.price,
        0
      ),
    [constructorItems]
  );

  return (
    <>
      <BurgerConstructorUI
        price={price}
        orderRequest={isOrderCreating}
        constructorItems={constructorItems}
        orderModalData={orderModalData}
        onOrderClick={onOrderClick}
        closeOrderModal={closeOrderModal}
      />
      {orderCreateError && <p role="alert">{orderCreateError.message}</p>}
    </>
  );
};
