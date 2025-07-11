import { Container, MainLayout } from '@/components/layout';
import { ThemeToggle } from '@/components/theme';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ModalType, useModalStore } from '@/stores';
import UsersTable from './components/users-table/users-table';
import { useNavigate } from 'react-router';
import ROUTES from '@/constants/routes';
import { LogOut } from 'lucide-react';

const DashboardPage = () => {
  const { openModal } = useModalStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate(ROUTES.AUTH, { replace: true });
  };

  return (
    <MainLayout hideThemeToggle>
      <Card
        as="header"
        className="sticky top-0 z-40 w-full border-b border-purple-200/50 rounded-none"
      >
        <Container className="h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold tracking-tight text-primary dark:text-foreground">
              User Backoffice
            </h1>
          </div>

          <div className="flex items-center relative gap-4">
            <Button
              onClick={handleLogout}
              className="w-10 py-4.5 px-5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              variant="outline"
              size="icon"
              title="Logout"
              data-testid="logout-button"
            >
              <LogOut className="h-4 w-4" />
            </Button>
            <ThemeToggle className="w-10 py-4.5 px-5" variant="outline" />
          </div>
        </Container>
      </Card>

      <Container className="flex-wrap space-y-10 mt-10">
        <div className="flex w-full justify-between items-center">
          <div className="flex flex-col gap-2 w-full">
            <h1 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl dark:text-foreground">
              Welcome, user!
            </h1>
            <p className="text-muted-foreground">
              View, create, update and delete your users from here.
            </p>
          </div>
          <Button
            onClick={() => openModal(ModalType.CREATE)}
            className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            size="default"
            data-testid="create-user-button"
          >
            <span className="hidden sm:inline">Create User</span>
            <span className="sm:hidden">Create</span>
          </Button>
        </div>

        <Card as="section" className="w-full shadow-md dark:shadow-2xl dark:shadow-purple-900/50">
          <CardContent className="p-0">
            <UsersTable />
          </CardContent>
        </Card>
      </Container>
    </MainLayout>
  );
};

export default DashboardPage;
