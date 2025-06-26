import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/stores';
import { cn } from '@/utils';

const ThemeToggle = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className={cn(
        'cursor-pointer fixed top-4 right-4 z-50 transition-all duration-200',
        'border-purple-200 dark:border-purple-700',
        'bg-purple-50/80 dark:bg-purple-950/80',
        'hover:bg-purple-100 dark:hover:bg-purple-900',
        'hover:border-purple-300 dark:hover:border-purple-600',
        'shadow-purple-md hover:shadow-purple-lg',
        'backdrop-blur-sm',
        'text-purple-600 dark:text-purple-400',
        'hover:text-purple-700 dark:hover:text-purple-300',
      )}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
