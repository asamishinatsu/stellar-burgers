import { registerUser } from '@slices';
import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useDispatch } from '@services/store';

import type { Location } from 'react-router-dom';

export const Register = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    setError('');
    void dispatch(registerUser({ name: userName, email, password }))
      .unwrap()
      .then(() => {
        void navigate((location.state as { from?: Location } | null)?.from ?? '/', {
          replace: true,
        });
      })
      .catch((err: Error) => setError(err.message));
  };

  return (
    <RegisterUI
      errorText={error}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
