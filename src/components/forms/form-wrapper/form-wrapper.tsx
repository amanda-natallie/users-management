import { Button } from '@/components/ui/button';
import type { FormEvent, ReactNode } from 'react';

interface FormWrapperProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  submitText: string;
  isValid: boolean;
  loading?: boolean;
  loadingText?: string;
}

const FormWrapper = ({
  onSubmit,
  children,
  submitText,
  isValid,
  loading = false,
  loadingText = 'Loading...',
}: FormWrapperProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4" data-testid="form-wrapper">
      {children}
      <Button
        type="submit"
        className="w-full btn-purple transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] mt-4"
        disabled={!isValid || loading}
        loading={loading}
        aria-label={submitText}
        loadingText={loadingText}
      >
        {submitText}
      </Button>
    </form>
  );
};

export default FormWrapper;
