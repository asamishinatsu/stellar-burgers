import { selectFeed } from '@selectors';
import { fetchFeeds } from '@slices';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '@services/store';

const ORDERS_REFRESH_MS = 5000;

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector(selectFeed);

  const handleGetFeeds = (): void => {
    void dispatch(fetchFeeds());
  };

  useEffect(() => {
    void dispatch(fetchFeeds());
    const interval = window.setInterval(() => {
      void dispatch(fetchFeeds());
    }, ORDERS_REFRESH_MS);
    return (): void => window.clearInterval(interval);
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  if (error && !orders.length) {
    return <p role="alert">Не удалось загрузить ленту заказов: {error.message}</p>;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
