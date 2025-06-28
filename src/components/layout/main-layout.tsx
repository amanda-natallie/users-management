import { ThemeToggle } from '@/components/theme';
import { Toaster } from '@/components/ui/sonner';
import { type ReactNode } from 'react';
import Modal from './modal';

interface MainLayoutProps {
  children: ReactNode;
  dataTestId?: string;
  hideThemeToggle?: boolean;
}

const MainLayout = ({ children, dataTestId, hideThemeToggle = false }: MainLayoutProps) => {
  return (
    <main className="relative" data-testid={dataTestId}>
      {!hideThemeToggle && <ThemeToggle className="fixed bottom-6 right-6 z-50" />}
      <Toaster />
      <Modal />
      {children}
    </main>
  );
};

export default MainLayout;
