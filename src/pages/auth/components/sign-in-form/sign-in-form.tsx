'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, type SignInFormData } from '@/schemas';
import { AuthLayout } from '@/components/layout';
import { FormWrapper, ControlledFormField } from '@/components/forms';

interface SignInFormProps {
  onSwitchToSignUp: () => void;
  isFlipping?: boolean;
}

const SignInForm = ({ onSwitchToSignUp, isFlipping = false }: SignInFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: SignInFormData) => {
    console.log('Sign in form is valid and ready to submit:', data);
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Enter your credentials to sign in to your account"
      switchText="Don't have an account?"
      switchButtonText="Sign up"
      onSwitch={onSwitchToSignUp}
      isFlipping={isFlipping}
    >
      <FormWrapper onSubmit={handleSubmit(onSubmit)} submitText="Sign In" isValid={isValid}>
        <ControlledFormField
          name="email"
          control={control}
          id="signin-email"
          label="Email"
          type="email"
          placeholder="m@example.com"
          error={errors.email?.message}
        />

        <ControlledFormField
          name="password"
          control={control}
          id="signin-password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />
      </FormWrapper>
    </AuthLayout>
  );
};

export default SignInForm;
