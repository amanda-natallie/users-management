import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import FormField from '../form-field/form-field';

export interface ControlledFormFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  id: string;
  label: string;
  type?: 'email' | 'password' | 'text';
  placeholder?: string;
  error?: string;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
}

const ControlledFormField = <T extends FieldValues>({
  name,
  control,
  ...formFieldProps
}: ControlledFormFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <FormField {...field} {...formFieldProps} />}
    />
  );
};

export default ControlledFormField;
