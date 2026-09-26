import { checkPasswordReset, confirmPasswordReset } from '@slices';
import { ResetPasswordUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from '@services/store';

export const ResetPassword = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: SyntheticEvent): void => {
    event.preventDefault();
    setError('');
    void dispatch(confirmPasswordReset({ password, token }))
      .unwrap()
      .then(() => void navigate('/login'))
      .catch((requestError: Error) => setError(requestError.message));
  };

  useEffect(() => {
    void dispatch(checkPasswordReset())
      .unwrap()
      .then((isRequested): void => {
        if (!isRequested) void navigate('/forgot-password', { replace: true });
      })
      .catch(() => void navigate('/forgot-password', { replace: true }));
  }, [dispatch, navigate]);

  return (
    <ResetPasswordUI
      errorText={error}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
