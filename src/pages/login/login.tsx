import { loginUser } from '@slices';
import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDispatch } from '@services/store';

import type { Location } from 'react-router-dom';

export const Login = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    setError('');
    void dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        void navigate((location.state as { from?: Location } | null)?.from ?? '/', {
          replace: true,
        });
      })
      .catch((err: Error) => setError(err.message));
  };

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
