import type { TProfileForm } from '@utils-types';
import type { ChangeEvent, SyntheticEvent } from 'react';

export type ProfileUIProps = {
  formValue: TProfileForm;
  isFormChanged: boolean;
  handleSubmit: (e: SyntheticEvent) => void;
  handleCancel: (e: SyntheticEvent) => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  updateUserError?: string;
};
