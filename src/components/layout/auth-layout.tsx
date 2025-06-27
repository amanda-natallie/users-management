import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  switchText: string;
  switchButtonText: string;
  onSwitch: () => void;
  isFlipping?: boolean;
}

const AuthLayout = ({
  title,
  subtitle,
  children,
  switchText,
  switchButtonText,
  onSwitch,
  isFlipping = false,
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-purple">
      <div className="w-full max-w-md perspective-1000">
        <Card
          className={cn(
            'transition-transform duration-300 transform-style-preserve-3d shadow-purple border-purple-200/50 dark:border-purple-800/50 dark:bg-muted/90',
            isFlipping && 'animate-pulse scale-95',
          )}
        >
          <CardContent className="p-8">
            <div
              className={cn(
                'transition-opacity duration-150 animate-fade-in',
                isFlipping ? 'opacity-0' : 'opacity-100',
              )}
            >
              <div className="space-y-10">
                <div className="space-y-2 text-center">
                  <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                  <p className="text-muted-foreground text-sm">{subtitle}</p>
                </div>

                {children}

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {switchText}{' '}
                    <Button
                      variant="link"
                      className="p-0 h-auto font-semibold text-primary hover:text-primary/80 focus-ring cursor-pointer"
                      onClick={onSwitch}
                    >
                      {switchButtonText}
                    </Button>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthLayout;
