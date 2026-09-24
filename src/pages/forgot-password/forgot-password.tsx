import { requestPasswordReset } from '@slices';
import { ForgotPasswordUI } from '@ui-pages';
import { useState, type SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from '@services/store';

export const ForgotPassword = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: SyntheticEvent): void => {
    event.preventDefault();
    setError('');
    void dispatch(requestPasswordReset({ email }))
      .unwrap()
      .then(() => void navigate('/reset-password', { replace: true }))
      .catch((requestError: Error) => setError(requestError.message));
  };

  return (
    <ForgotPasswordUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
