import { clsx } from 'clsx';

import type { TDetailsPageProps } from './type';
import type React from 'react';

import styles from './details-page.module.css';

export const DetailsPage = ({
  title,
  children,
}: TDetailsPageProps): React.JSX.Element => {
  return (
    <div className={styles.detailPageWrap}>
      <h1 className={clsx('text text_type_main-large', styles.detailHeader)}>{title}</h1>
      {children}
    </div>
  );
};
