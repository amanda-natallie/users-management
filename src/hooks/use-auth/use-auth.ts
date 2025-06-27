import ROUTES from '@/constants/routes';
import useToast from '@/hooks/use-toast/use-toast';
import { AuthService, type LoginPayload, type RegisterPayload } from '@/services';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

export const useRegister = () => {
  const toast = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const promise = AuthService.register(payload);

      toast.promise(promise, {
        loading: 'Creating your account...',
        success: 'Account created successfully! Welcome aboard!',
        error: 'Registration failed. Please check your information and try again.',
      });

      return await promise;
    },
    onSuccess: data => {
      if (data && typeof data === 'object' && 'token' in data && !('error' in data)) {
        AuthService.setToken(data.token);
        navigate(ROUTES.HOME, { replace: true });
      }
    },
    onError: error => {
      console.error('Register mutation error:', error);
    },
  });
};

export const useLogin = () => {
  const toast = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      console.log('LOG:: useLogin mutationFn called', payload);
      const promise = AuthService.login(payload);

      toast.promise(promise, {
        loading: 'Signing you in...',
        success: 'Welcome back! You have been successfully signed in.',
        error: 'Login failed. Please check your credentials and try again.',
      });

      return await promise;
    },
    onSuccess: data => {
      if (data && typeof data === 'object' && 'token' in data && !('error' in data)) {
        AuthService.setToken(data.token);
        navigate(ROUTES.HOME, { replace: true });
      }
    },
    onError: error => {
      console.error('Login mutation error:', error);
    },
  });
};

export const useLogout = () => {
  const toast = useToast();

  return useMutation({
    mutationFn: async () => {
      const promise = Promise.resolve();

      toast.promise(promise, {
        loading: 'Signing you out...',
        success: 'You have been successfully signed out.',
        error: 'Logout failed. Please try again.',
      });

      AuthService.removeToken();
      return promise;
    },
  });
};
