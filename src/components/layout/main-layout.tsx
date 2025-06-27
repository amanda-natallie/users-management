import { ThemeToggle } from '@/components/theme';
import { ReactNode } from 'react';
import { Toaster } from '../ui/sonner';
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
