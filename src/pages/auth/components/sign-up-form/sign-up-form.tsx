import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, type SignUpFormData } from '@/schemas';
import { AuthLayout } from '@/components/layout';
import { FormWrapper, ControlledFormField, PasswordStrength } from '@/components/forms';

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
  isFlipping?: boolean;
}

const SignUpForm = ({ onSwitchToSignIn, isFlipping = false }: SignUpFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password', '');

  const onSubmit = (data: SignUpFormData) => {
    console.log('Sign up form is valid and ready to submit:', data);
  };

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Enter your information to create your account"
      switchText="Already have an account?"
      switchButtonText="Sign in"
      onSwitch={onSwitchToSignIn}
      isFlipping={isFlipping}
    >
      <FormWrapper onSubmit={handleSubmit(onSubmit)} submitText="Create Account" isValid={isValid}>
        <ControlledFormField
          name="email"
          control={control}
          id="signup-email"
          label="Email"
          type="email"
          placeholder="m@example.com"
          error={errors.email?.message}
        />

        <div className="space-y-2">
          <ControlledFormField
            name="password"
            control={control}
            id="signup-password"
            label="Password"
            type="password"
            placeholder="Create a password"
            error={errors.password?.message}
            showPasswordToggle
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
          <PasswordStrength password={password} isVisible={passwordFocused} />
        </div>

        <ControlledFormField
          name="confirmPassword"
          control={control}
          id="signup-confirm-password"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          error={errors.confirmPassword?.message}
          showPasswordToggle
          showPassword={showConfirmPassword}
          onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
        />
      </FormWrapper>
    </AuthLayout>
  );
};

export default SignUpForm;
