import { ControlledFormField, FormWrapper } from '@/components/forms';
import { AuthLayout } from '@/components/layout';
import { useLogin } from '@/hooks';
import { signInSchema, type SignInFormData } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface SignInFormProps {
  onSwitchToSignUp: () => void;
  isFlipping?: boolean;
}

const SignInForm = ({ onSwitchToSignUp, isFlipping = false }: SignInFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();

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

  const onSubmit = async (data: SignInFormData) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {
      console.error('Login error:', error);
    }
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
      <FormWrapper
        onSubmit={handleSubmit(onSubmit)}
        submitText="Sign In"
        isValid={isValid}
        loading={loginMutation.isPending}
        loadingText="Signing in..."
      >
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
