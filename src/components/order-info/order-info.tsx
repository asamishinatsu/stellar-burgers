import { selectIngredients, selectOrders } from '@selectors';
import { fetchOrderByNumber } from '@slices';
import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { number } = useParams();
  const orderNumber = Number(number);
  const isValidOrderNumber = Number.isInteger(orderNumber) && orderNumber > 0;
  const ingredients = useSelector(selectIngredients);
  const { selectedOrder, orderDetailsError } = useSelector(selectOrders);

  useEffect(() => {
    if (!isValidOrderNumber) return;
    const request = dispatch(fetchOrderByNumber(orderNumber));
    return (): void => request.abort();
  }, [dispatch, isValidOrderNumber, orderNumber]);

  const orderInfo = useMemo(() => {
    if (!selectedOrder || selectedOrder.number !== orderNumber || !ingredients.length) {
      return null;
    }

    const date = new Date(selectedOrder.createdAt);
    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = selectedOrder.ingredients.reduce(
      (accumulator: TIngredientsWithCount, ingredientId) => {
        if (!accumulator[ingredientId]) {
          const ingredient = ingredients.find((item) => item._id === ingredientId);
          if (ingredient) {
            accumulator[ingredientId] = { ...ingredient, count: 1 };
          }
        } else {
          accumulator[ingredientId].count++;
        }
        return accumulator;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (sum, ingredient) => sum + ingredient.price * ingredient.count,
      0
    );

    return { ...selectedOrder, ingredientsInfo, date, total };
  }, [selectedOrder, orderNumber, ingredients]);

  if (!isValidOrderNumber) return <p role="alert">Неверный номер заказа</p>;
  if (orderDetailsError) return <p role="alert">{orderDetailsError.message}</p>;
  if (!orderInfo) return <Preloader />;
  return <OrderInfoUI orderInfo={orderInfo} />;
};
