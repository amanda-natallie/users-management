import { FullscreenLoader } from '@/components/layout';
import ROUTES from '@/constants/routes';
import { authUtils } from '@/utils/auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();

  const isAuthenticated = authUtils.isAuthenticated();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.AUTH, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return <FullscreenLoader message="Checking authentication..." />;
  }

  return <div data-testid="auth-guard">{children}</div>;
};

export default AuthGuard;
