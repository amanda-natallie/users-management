import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils';

interface FormFieldProps {
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

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      id,
      label,
      type = 'text',
      placeholder,
      error,
      showPasswordToggle = false,
      showPassword = false,
      onTogglePassword,
      onFocus,
      onBlur,
      className,
      ...props
    },
    ref,
  ) => {
    const inputType = type === 'password' && showPassword ? 'text' : type;

    return (
      <div className="space-y-2 animate-slide-in">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        <div className="relative">
          <Input
            {...props}
            id={id}
            ref={ref}
            type={inputType}
            placeholder={placeholder}
            onFocus={onFocus}
            onBlur={onBlur}
            className={cn(
              'transition-all duration-200',
              error
                ? 'focus-visible:ring-red-500/50 focus-visible:border-red-500'
                : 'focus-visible:ring-ring focus-visible:ring-1',
              showPasswordToggle ? 'pr-10' : '',
              className,
            )}
          />
          {showPasswordToggle && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent focus-ring"
              onClick={onTogglePassword}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          )}
        </div>
        {error && <p className="text-sm text-red-500 animate-fade-in">{error}</p>}
      </div>
    );
  },
);

FormField.displayName = 'FormField';

export default FormField;
