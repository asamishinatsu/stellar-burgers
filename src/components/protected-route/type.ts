import type { ReactNode } from 'react';

export type ProtectedRouteProps = {
  children: ReactNode;
  isPrivate?: boolean;
};
