import { toast } from 'sonner';
import useToast from './use-toast';

jest.mock('sonner', () => ({
  toast: Object.assign(jest.fn(), {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
    promise: jest.fn(),
  }),
}));

describe('useToast', () => {
  let toastHook: ReturnType<typeof useToast>;

  beforeEach(() => {
    toastHook = useToast();
    jest.clearAllMocks();
  });

  describe('success', () => {
    it('should call toast.success with default duration', () => {
      const message = 'Success message';
      toastHook.success(message);

      expect(toast.success).toHaveBeenCalledWith(message, {
        description: undefined,
        duration: 4000,
      });
    });

    it('should call toast.success with custom options', () => {
      const message = 'Success message';
      const options = {
        description: 'Success description',
        duration: 6000,
      };

      toastHook.success(message, options);

      expect(toast.success).toHaveBeenCalledWith(message, {
        description: 'Success description',
        duration: 6000,
      });
    });

    it('should call toast.success with partial options', () => {
      const message = 'Success message';
      const options = {
        description: 'Success description',
      };

      toastHook.success(message, options);

      expect(toast.success).toHaveBeenCalledWith(message, {
        description: 'Success description',
        duration: 4000,
      });
    });
  });

  describe('error', () => {
    it('should call toast.error with default duration', () => {
      const message = 'Error message';
      toastHook.error(message);

      expect(toast.error).toHaveBeenCalledWith(message, {
        description: undefined,
        duration: 5000,
      });
    });

    it('should call toast.error with custom options', () => {
      const message = 'Error message';
      const options = {
        description: 'Error description',
        duration: 8000,
      };

      toastHook.error(message, options);

      expect(toast.error).toHaveBeenCalledWith(message, {
        description: 'Error description',
        duration: 8000,
      });
    });

    it('should call toast.error with partial options', () => {
      const message = 'Error message';
      const options = {
        description: 'Error description',
      };

      toastHook.error(message, options);

      expect(toast.error).toHaveBeenCalledWith(message, {
        description: 'Error description',
        duration: 5000,
      });
    });
  });

  describe('warning', () => {
    it('should call toast.warning with default duration', () => {
      const message = 'Warning message';
      toastHook.warning(message);

      expect(toast.warning).toHaveBeenCalledWith(message, {
        description: undefined,
        duration: 4000,
      });
    });

    it('should call toast.warning with custom options', () => {
      const message = 'Warning message';
      const options = {
        description: 'Warning description',
        duration: 6000,
      };

      toastHook.warning(message, options);

      expect(toast.warning).toHaveBeenCalledWith(message, {
        description: 'Warning description',
        duration: 6000,
      });
    });

    it('should call toast.warning with partial options', () => {
      const message = 'Warning message';
      const options = {
        description: 'Warning description',
      };

      toastHook.warning(message, options);

      expect(toast.warning).toHaveBeenCalledWith(message, {
        description: 'Warning description',
        duration: 4000,
      });
    });
  });

  describe('info', () => {
    it('should call toast.info with default duration', () => {
      const message = 'Info message';
      toastHook.info(message);

      expect(toast.info).toHaveBeenCalledWith(message, {
        description: undefined,
        duration: 4000,
      });
    });

    it('should call toast.info with custom options', () => {
      const message = 'Info message';
      const options = {
        description: 'Info description',
        duration: 6000,
      };

      toastHook.info(message, options);

      expect(toast.info).toHaveBeenCalledWith(message, {
        description: 'Info description',
        duration: 6000,
      });
    });

    it('should call toast.info with partial options', () => {
      const message = 'Info message';
      const options = {
        description: 'Info description',
      };

      toastHook.info(message, options);

      expect(toast.info).toHaveBeenCalledWith(message, {
        description: 'Info description',
        duration: 4000,
      });
    });
  });

  describe('default', () => {
    it('should call toast with default duration', () => {
      const message = 'Default message';
      toastHook.default(message);

      expect(toast).toHaveBeenCalledWith(message, {
        description: undefined,
        duration: 4000,
      });
    });

    it('should call toast with custom options', () => {
      const message = 'Default message';
      const options = {
        description: 'Default description',
        duration: 6000,
      };

      toastHook.default(message, options);

      expect(toast).toHaveBeenCalledWith(message, {
        description: 'Default description',
        duration: 6000,
      });
    });

    it('should call toast with partial options', () => {
      const message = 'Default message';
      const options = {
        description: 'Default description',
      };

      toastHook.default(message, options);

      expect(toast).toHaveBeenCalledWith(message, {
        description: 'Default description',
        duration: 4000,
      });
    });
  });

  describe('promise', () => {
    it('should call toast.promise with promise and messages', () => {
      const promise = Promise.resolve('success');
      const messages = {
        loading: 'Loading...',
        success: 'Success!',
        error: 'Error!',
      };

      toastHook.promise(promise, messages);

      expect(toast.promise).toHaveBeenCalledWith(promise, messages);
    });

    it('should call toast.promise with function messages', () => {
      const promise = Promise.resolve('success');
      const messages = {
        loading: 'Loading...',
        success: (data: string) => `Success: ${data}`,
        error: (error: Error) => `Error: ${error.message}`,
      };

      toastHook.promise(promise, messages);

      expect(toast.promise).toHaveBeenCalledWith(promise, messages);
    });

    it('should return the result of toast.promise', () => {
      const promise = Promise.resolve('success');
      const messages = {
        loading: 'Loading...',
        success: 'Success!',
        error: 'Error!',
      };

      const mockReturnValue = { id: 'toast-id' };
      (toast.promise as jest.Mock).mockReturnValue(mockReturnValue);

      const result = toastHook.promise(promise, messages);

      expect(result).toBe(mockReturnValue);
    });
  });

  describe('returned object', () => {
    it('should return an object with all expected methods', () => {
      const result = useToast();

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('error');
      expect(result).toHaveProperty('warning');
      expect(result).toHaveProperty('info');
      expect(result).toHaveProperty('default');
      expect(result).toHaveProperty('promise');

      expect(typeof result.success).toBe('function');
      expect(typeof result.error).toBe('function');
      expect(typeof result.warning).toBe('function');
      expect(typeof result.info).toBe('function');
      expect(typeof result.default).toBe('function');
      expect(typeof result.promise).toBe('function');
    });
  });
});
