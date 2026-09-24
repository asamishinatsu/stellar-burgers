import { selectUser } from '@selectors';
import { updateUser } from '@slices';
import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

import { useDispatch, useSelector } from '@services/store';

import type { TRegisterData } from '@api';

export const Profile = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser)!;
  const [formValue, setFormValue] = useState({
    name: user.name,
    email: user.email,
    password: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    setFormValue({ name: user.name, email: user.email, password: '' });
  }, [user]);

  const isFormChanged =
    formValue.name !== user.name ||
    formValue.email !== user.email ||
    !!formValue.password;

  const handleSubmit = (event: SyntheticEvent): void => {
    event.preventDefault();
    if (!isFormChanged) return;
    setError('');

    const changes: Partial<TRegisterData> = {};
    if (formValue.name !== user.name) changes.name = formValue.name;
    if (formValue.email !== user.email) changes.email = formValue.email;
    if (formValue.password) changes.password = formValue.password;

    void dispatch(updateUser(changes))
      .unwrap()
      .catch((requestError: Error) => setError(requestError.message));
  };

  const handleCancel = (event: SyntheticEvent): void => {
    event.preventDefault();
    setError('');
    setFormValue({ name: user.name, email: user.email, password: '' });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((previousValue) => ({
      ...previousValue,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={error}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
