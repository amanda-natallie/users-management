import { ThemeToggle } from '@/components/theme';
import { Toaster } from '@/components/ui/sonner';
import { type ReactNode } from 'react';
import Modal from './modal';

interface MainLayoutProps {
  children: ReactNode;
  dataTestId?: string;
}

const MainLayout = ({ children, dataTestId }: MainLayoutProps) => {
  return (
    <div className="relative" data-testid={dataTestId}>
      <ThemeToggle />
      <Toaster />
      <Modal />
      {children}
    </div>
  );
};

export default MainLayout;
