import { logoutUser } from '@slices';
import { ProfileMenuUI } from '@ui';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDispatch } from '@services/store';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogout = (): void => {
    setError('');
    void dispatch(logoutUser())
      .unwrap()
      .then(() => void navigate('/login', { replace: true }))
      .catch((requestError: Error) => setError(requestError.message));
  };

  return (
    <>
      <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />
      {error && <p role="alert">{error}</p>}
    </>
  );
};
