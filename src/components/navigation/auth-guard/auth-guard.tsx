import { FullscreenLoader } from '@/components/layout';
import ROUTES from '@/constants/routes';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('userToken');

    if (!isAuthenticated) {
      navigate(ROUTES.AUTH, { replace: true });
    }
  }, [navigate]);

  const isAuthenticated = localStorage.getItem('userToken');

  if (!isAuthenticated) {
    return <FullscreenLoader message="Checking authentication..." />;
  }

  return <div data-testid="auth-guard">{children}</div>;
};

export default AuthGuard;
