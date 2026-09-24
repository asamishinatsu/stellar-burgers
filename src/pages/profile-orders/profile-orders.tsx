import { selectOrders } from '@selectors';
import { fetchUserOrders } from '@slices';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '@services/store';

const ORDERS_REFRESH_MS = 5000;

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { userOrders, userOrdersError } = useSelector(selectOrders);

  useEffect(() => {
    void dispatch(fetchUserOrders());
    const interval = window.setInterval(() => {
      void dispatch(fetchUserOrders());
    }, ORDERS_REFRESH_MS);
    return (): void => window.clearInterval(interval);
  }, [dispatch]);

  return (
    <>
      {userOrdersError && (
        <p role="alert">
          Не удалось загрузить историю заказов: {userOrdersError.message}
        </p>
      )}
      <ProfileOrdersUI orders={userOrders} />
    </>
  );
};
