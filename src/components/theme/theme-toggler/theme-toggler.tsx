import { Button, ButtonProps } from '@/components/ui/button';
import { useThemeStore } from '@/stores';
import { cn } from '@/utils';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  variant?: ButtonProps['variant'];
}

const ThemeToggle = ({ className, variant = 'secondary' }: ThemeToggleProps) => {
  const { theme, setTheme } = useThemeStore();

  return (
    <Button
      variant={variant}
      size="sm"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className={cn(
        'focus-ring transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg',
        className,
      )}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
