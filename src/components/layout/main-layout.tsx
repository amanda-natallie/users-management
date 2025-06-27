import { ThemeToggle } from '@/components/theme';
import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
  dataTestId?: string;
}

const MainLayout = ({ children, dataTestId }: MainLayoutProps) => {
  return (
    <div className="relative" data-testid={dataTestId}>
      <ThemeToggle />
      {children}
    </div>
  );
};

export default MainLayout;
