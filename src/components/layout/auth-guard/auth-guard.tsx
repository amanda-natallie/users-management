import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import FullscreenLoader from '../fullscreen-loader';
import { ROUTES } from '@/constants/routes';

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

  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('userToken');

  if (!isAuthenticated) {
    return <FullscreenLoader message="Checking authentication..." />;
  }

  return <>{children}</>;
};

export default AuthGuard;
