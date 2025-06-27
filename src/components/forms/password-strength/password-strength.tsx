import { Check, X } from 'lucide-react';
import { cn } from '@/utils';

interface PasswordStrengthProps {
  password: string;
  isVisible: boolean;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: PasswordRequirement[] = [
  {
    label: 'At least 8 characters',
    test: password => password.length >= 8,
  },
  {
    label: 'One uppercase letter',
    test: password => /[A-Z]/.test(password),
  },
  {
    label: 'One lowercase letter',
    test: password => /[a-z]/.test(password),
  },
  {
    label: 'One number',
    test: password => /[0-9]/.test(password),
  },
  {
    label: 'One special character',
    test: password => /[^A-Za-z0-9]/.test(password),
  },
];

const PasswordStrength = ({ password, isVisible }: PasswordStrengthProps) => {
  if (!isVisible) return null;

  return (
    <div className="mt-2 space-y-2 rounded-md border p-3 bg-purple-muted border-purple-muted animate-fade-in">
      <p className="text-sm font-medium text-primary">Password requirements:</p>
      <div className="space-y-1">
        {requirements.map((requirement, index) => {
          const isValid = requirement.test(password);
          return (
            <div
              key={index}
              className="flex items-center gap-2 text-sm transition-all duration-200"
            >
              {isValid ? (
                <Check
                  className="h-4 w-4 text-green-500 animate-fade-in"
                  data-testid="check-icon"
                />
              ) : (
                <X className="h-4 w-4 text-muted-foreground" data-testid="x-icon" />
              )}
              <span
                className={cn(
                  'transition-colors duration-200',
                  isValid ? 'text-primary font-medium' : 'text-muted-foreground',
                )}
              >
                {requirement.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrength;
