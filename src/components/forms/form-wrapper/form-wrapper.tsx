import type { ReactNode, FormEvent } from 'react';
import { Button } from '@/components/ui/button';

interface FormWrapperProps {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  submitText: string;
  isValid: boolean;
}

const FormWrapper = ({ onSubmit, children, submitText, isValid }: FormWrapperProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4" data-testid="form-wrapper">
      {children}
      <Button
        type="submit"
        className="w-full btn-purple transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] mt-4"
        disabled={!isValid}
      >
        {submitText}
      </Button>
    </form>
  );
};

export default FormWrapper;
