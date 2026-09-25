import { selectOrders } from '@selectors';
import { fetchUserOrders } from '@slices';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '@services/store';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { userOrders, userOrdersError } = useSelector(selectOrders);

  useEffect(() => {
    void dispatch(fetchUserOrders());
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
