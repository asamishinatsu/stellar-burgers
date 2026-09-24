import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

import type { ProtectedRouteProps } from './type';

export const ProtectedRoute = ({
  children,
  isPrivate,
}: ProtectedRouteProps): React.JSX.Element => {
  const location = useLocation();
  const user = null;
  const isAuthChecked = null;

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

  return user ? <Navigate to="/" replace /> : <>{children}</>;
};
