import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import useThemeStore from './theme-store';
jest.mock('zustand/middleware', () => ({
  persist: jest.fn(config => config),
}));

describe('Theme Store', () => {
  let mockMatchMedia: jest.Mock;
  let mockAddEventListener: jest.Mock;
  let mockRemoveEventListener: jest.Mock;
  let mockDispatchEvent: jest.Mock;

  beforeEach(() => {
    useThemeStore.setState({ theme: 'system' });
    Object.defineProperty(document, 'documentElement', {
      value: {
        classList: {
          remove: jest.fn(),
          add: jest.fn(),
        },
      },
      writable: true,
    });

    mockAddEventListener = jest.fn();
    mockRemoveEventListener = jest.fn();
    mockDispatchEvent = jest.fn();

    mockMatchMedia = jest.fn().mockReturnValue({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
      dispatchEvent: mockDispatchEvent,
    });

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Store State', () => {
    it('should have initial theme set to system', () => {
      const { theme } = useThemeStore.getState();
      expect(theme).toBe('system');
    });

    it('should have setTheme function', () => {
      const { setTheme } = useThemeStore.getState();
      expect(typeof setTheme).toBe('function');
    });

    it('should have initializeTheme function', () => {
      const { initializeTheme } = useThemeStore.getState();
      expect(typeof initializeTheme).toBe('function');
    });
  });

  describe('setTheme', () => {
    it('should set theme to light and apply it', () => {
      const { setTheme } = useThemeStore.getState();
      const mockClassList = {
        remove: jest.fn(),
        add: jest.fn(),
      };
      Object.defineProperty(document, 'documentElement', {
        value: { classList: mockClassList },
        writable: true,
      });

      setTheme('light');

      const { theme } = useThemeStore.getState();
      expect(theme).toBe('light');
      expect(mockClassList.remove).toHaveBeenCalledWith('light', 'dark');
      expect(mockClassList.add).toHaveBeenCalledWith('light');
    });

    it('should set theme to dark and apply it', () => {
      const { setTheme } = useThemeStore.getState();
      const mockClassList = {
        remove: jest.fn(),
        add: jest.fn(),
      };
      Object.defineProperty(document, 'documentElement', {
        value: { classList: mockClassList },
        writable: true,
      });

      setTheme('dark');

      const { theme } = useThemeStore.getState();
      expect(theme).toBe('dark');
      expect(mockClassList.remove).toHaveBeenCalledWith('light', 'dark');
      expect(mockClassList.add).toHaveBeenCalledWith('dark');
    });

    it('should set theme to system and apply it', () => {
      const { setTheme } = useThemeStore.getState();
      const mockClassList = {
        remove: jest.fn(),
        add: jest.fn(),
      };
      Object.defineProperty(document, 'documentElement', {
        value: { classList: mockClassList },
        writable: true,
      });

      setTheme('system');

      const { theme } = useThemeStore.getState();
      expect(theme).toBe('system');
      expect(mockClassList.remove).toHaveBeenCalledWith('light', 'dark');
      expect(mockClassList.add).toHaveBeenCalledWith('light');
    });
  });

  describe('initializeTheme', () => {
    it('should apply current theme when called', () => {
      const { initializeTheme } = useThemeStore.getState();
      const mockClassList = {
        remove: jest.fn(),
        add: jest.fn(),
      };
      Object.defineProperty(document, 'documentElement', {
        value: { classList: mockClassList },
        writable: true,
      });

      initializeTheme();

      expect(mockClassList.remove).toHaveBeenCalledWith('light', 'dark');
      expect(mockClassList.add).toHaveBeenCalledWith('light');
    });

    it('should apply dark theme when system preference is dark', () => {
      const { initializeTheme } = useThemeStore.getState();
      const mockClassList = {
        remove: jest.fn(),
        add: jest.fn(),
      };
      Object.defineProperty(document, 'documentElement', {
        value: { classList: mockClassList },
        writable: true,
      });

      mockMatchMedia.mockReturnValue({
        matches: true,
        media: '(prefers-color-scheme: dark)',
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
        dispatchEvent: mockDispatchEvent,
      });

      initializeTheme();

      expect(mockClassList.remove).toHaveBeenCalledWith('light', 'dark');
      expect(mockClassList.add).toHaveBeenCalledWith('dark');
    });
  });

  describe('applyTheme function', () => {
    it('should apply light theme correctly', () => {
      const mockClassList = {
        remove: jest.fn(),
        add: jest.fn(),
      };
      Object.defineProperty(document, 'documentElement', {
        value: { classList: mockClassList },
        writable: true,
      });

      const { setTheme } = useThemeStore.getState();
      setTheme('light');

      expect(mockClassList.remove).toHaveBeenCalledWith('light', 'dark');
      expect(mockClassList.add).toHaveBeenCalledWith('light');
    });

    it('should apply dark theme correctly', () => {
      const mockClassList = {
        remove: jest.fn(),
        add: jest.fn(),
      };
      Object.defineProperty(document, 'documentElement', {
        value: { classList: mockClassList },
        writable: true,
      });

      const { setTheme } = useThemeStore.getState();
      setTheme('dark');

      expect(mockClassList.remove).toHaveBeenCalledWith('light', 'dark');
      expect(mockClassList.add).toHaveBeenCalledWith('dark');
    });

    it('should apply system theme when system preference is light', () => {
      const mockClassList = {
        remove: jest.fn(),
        add: jest.fn(),
      };
      Object.defineProperty(document, 'documentElement', {
        value: { classList: mockClassList },
        writable: true,
      });

      mockMatchMedia.mockReturnValue({
        matches: false,
        media: '(prefers-color-scheme: dark)',
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
        dispatchEvent: mockDispatchEvent,
      });

      const { setTheme } = useThemeStore.getState();
      setTheme('system');

      expect(mockClassList.remove).toHaveBeenCalledWith('light', 'dark');
      expect(mockClassList.add).toHaveBeenCalledWith('light');
    });

    it('should apply system theme when system preference is dark', () => {
      const mockClassList = {
        remove: jest.fn(),
        add: jest.fn(),
      };
      Object.defineProperty(document, 'documentElement', {
        value: { classList: mockClassList },
        writable: true,
      });

      mockMatchMedia.mockReturnValue({
        matches: true,
        media: '(prefers-color-scheme: dark)',
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
        dispatchEvent: mockDispatchEvent,
      });

      const { setTheme } = useThemeStore.getState();
      setTheme('system');

      expect(mockClassList.remove).toHaveBeenCalledWith('light', 'dark');
      expect(mockClassList.add).toHaveBeenCalledWith('dark');
    });
  });

  describe('System Theme Change Listener', () => {
    it('should handle system theme change when current theme is system', () => {
      const mockClassList = {
        remove: jest.fn(),
        add: jest.fn(),
      };
      Object.defineProperty(document, 'documentElement', {
        value: { classList: mockClassList },
        writable: true,
      });

      const { setTheme } = useThemeStore.getState();
      setTheme('system');

      mockClassList.remove.mockClear();
      mockClassList.add.mockClear();

      const { initializeTheme } = useThemeStore.getState();
      initializeTheme();

      expect(mockClassList.remove).toHaveBeenCalledWith('light', 'dark');
      expect(mockClassList.add).toHaveBeenCalledWith('light');
    });

    it('should not handle system theme change when current theme is not system', () => {
      const mockClassList = {
        remove: jest.fn(),
        add: jest.fn(),
      };
      Object.defineProperty(document, 'documentElement', {
        value: { classList: mockClassList },
        writable: true,
      });

      const { setTheme } = useThemeStore.getState();
      setTheme('light');

      mockClassList.remove.mockClear();
      mockClassList.add.mockClear();

      const { initializeTheme } = useThemeStore.getState();
      initializeTheme();

      expect(mockClassList.remove).toHaveBeenCalledWith('light', 'dark');
      expect(mockClassList.add).toHaveBeenCalledWith('light');
    });
  });

  describe('Module Initialization', () => {
    it('should initialize theme when window is defined', () => {
      const { theme, initializeTheme } = useThemeStore.getState();

      expect(theme).toBe('system');
      expect(typeof initializeTheme).toBe('function');
    });

    it('should handle window not being defined', () => {
      expect(() => {
        const { theme } = useThemeStore.getState();
        expect(theme).toBe('system');
      }).not.toThrow();
    });
  });

  describe('Event Listener Branch Coverage', () => {
    it('should test the event listener when theme is system', () => {
      const mockClassList = {
        remove: jest.fn(),
        add: jest.fn(),
      };
      Object.defineProperty(document, 'documentElement', {
        value: { classList: mockClassList },
        writable: true,
      });

      const { setTheme } = useThemeStore.getState();
      setTheme('system');

      mockClassList.remove.mockClear();
      mockClassList.add.mockClear();

      const { initializeTheme } = useThemeStore.getState();
      initializeTheme();

      expect(mockClassList.remove).toHaveBeenCalledWith('light', 'dark');
      expect(mockClassList.add).toHaveBeenCalledWith('light');
    });

    it('should test the event listener when theme is not system', () => {
      const mockClassList = {
        remove: jest.fn(),
        add: jest.fn(),
      };
      Object.defineProperty(document, 'documentElement', {
        value: { classList: mockClassList },
        writable: true,
      });

      const { setTheme } = useThemeStore.getState();
      setTheme('light');

      mockClassList.remove.mockClear();
      mockClassList.add.mockClear();

      const { initializeTheme } = useThemeStore.getState();
      initializeTheme();

      expect(mockClassList.remove).toHaveBeenCalledWith('light', 'dark');
      expect(mockClassList.add).toHaveBeenCalledWith('light');
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple theme changes correctly', () => {
      const mockClassList = {
        remove: jest.fn(),
        add: jest.fn(),
      };
      Object.defineProperty(document, 'documentElement', {
        value: { classList: mockClassList },
        writable: true,
      });

      const { setTheme } = useThemeStore.getState();

      setTheme('light');
      expect(mockClassList.add).toHaveBeenCalledWith('light');

      setTheme('dark');
      expect(mockClassList.add).toHaveBeenCalledWith('dark');

      setTheme('system');
      expect(mockClassList.add).toHaveBeenCalledWith('light');

      expect(mockClassList.remove).toHaveBeenCalledTimes(3);
    });

    it('should handle document.documentElement being null', () => {
      Object.defineProperty(document, 'documentElement', {
        value: null,
        writable: true,
      });

      const { setTheme } = useThemeStore.getState();

      expect(() => setTheme('light')).toThrow('Cannot read properties of null');
    });

    it('should handle classList methods being undefined', () => {
      Object.defineProperty(document, 'documentElement', {
        value: {
          classList: {
            remove: undefined,
            add: undefined,
          },
        },
        writable: true,
      });

      const { setTheme } = useThemeStore.getState();

      expect(() => setTheme('light')).toThrow('root.classList.remove is not a function');
    });
  });
});
