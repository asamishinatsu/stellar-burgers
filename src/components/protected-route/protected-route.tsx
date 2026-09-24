import { selectAuthChecked, selectUser } from '@selectors';
import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

import { useSelector } from '@services/store';

import type { ProtectedRouteProps } from './type';
import type { Location } from 'react-router-dom';

export const ProtectedRoute = ({
  children,
  isPrivate,
}: ProtectedRouteProps): React.JSX.Element => {
  const location = useLocation();
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectAuthChecked);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (isPrivate) {
    return !user ? (
      <Navigate to="/login" replace state={{ from: location }} />
    ) : (
      <>{children}</>
    );
  }

  return user ? (
    <Navigate to={(location.state as { from?: Location } | null)?.from ?? '/'} replace />
  ) : (
    <>{children}</>
  );
};
