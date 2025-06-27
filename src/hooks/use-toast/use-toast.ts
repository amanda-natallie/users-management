import { toast } from 'sonner';

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
}

const useToast = () => {
  const showSuccess = (message: string, options?: ToastOptions) => {
    toast.success(message, {
      description: options?.description,
      duration: options?.duration || 4000,
    });
  };

  const showError = (message: string, options?: ToastOptions) => {
    toast.error(message, {
      description: options?.description,
      duration: options?.duration || 5000,
    });
  };

  const showWarning = (message: string, options?: ToastOptions) => {
    toast.warning(message, {
      description: options?.description,
      duration: options?.duration || 4000,
    });
  };

  const showInfo = (message: string, options?: ToastOptions) => {
    toast.info(message, {
      description: options?.description,
      duration: options?.duration || 4000,
    });
  };

  const showDefault = (message: string, options?: ToastOptions) => {
    toast(message, {
      description: options?.description,
      duration: options?.duration || 4000,
    });
  };

  const showPromise = <T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    },
  ) => {
    return toast.promise(promise, messages);
  };

  return {
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    default: showDefault,
    promise: showPromise,
  };
};

export default useToast;
