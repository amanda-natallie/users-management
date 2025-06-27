import { ControlledFormField, FormWrapper, PasswordStrength } from '@/components/forms';
import { AuthLayout } from '@/components/layout';
import { useRegister } from '@/hooks';
import { signUpSchema, type SignUpFormData } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface SignUpFormProps {
  onSwitchToSignIn: () => void;
  isFlipping?: boolean;
}

const SignUpForm = ({ onSwitchToSignIn, isFlipping = false }: SignUpFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const registerMutation = useRegister();

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

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await registerMutation.mutateAsync(data);
    } catch (error) {
      console.error('Registration error:', error);
    }
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
      <FormWrapper
        onSubmit={handleSubmit(onSubmit)}
        submitText="Create Account"
        isValid={isValid}
        loading={registerMutation.isPending}
        loadingText="Creating your account..."
      >
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
