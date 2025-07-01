import { Card, CardContent } from '@/components/ui/card';
import type { ReactNode } from 'react';

interface UserLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const UserLayout = ({ title, subtitle, children }: UserLayoutProps) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Card className="w-full p-0 border-none shadow-none">
        <CardContent className="space-y-10">
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground text-sm">{subtitle}</p>
          </div>

          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserLayout;
