import { OrderCard } from '@components';

import type { OrdersListUIProps } from './type';

import styles from './orders-list.module.css';

export const OrdersListUI = ({ orderByDate }: OrdersListUIProps): React.JSX.Element => {
  const orderElements = orderByDate.map((order) => (
    <OrderCard order={order} key={order._id} />
  ));

  return <div className={styles.content}>{orderElements}</div>;
};
