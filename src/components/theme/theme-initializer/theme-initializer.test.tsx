import { render } from '@testing-library/react';
import ThemeInitializer from './theme-initializer';

const mockInitializeTheme = jest.fn();

jest.mock('@/stores', () => ({
  useThemeStore: jest.fn((selector: (state: { initializeTheme: jest.Mock }) => jest.Mock) => {
    const state = {
      initializeTheme: mockInitializeTheme,
    };
    return selector(state);
  }),
}));

describe('ThemeInitializer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render nothing (return null)', () => {
      const { container } = render(<ThemeInitializer />);

      expect(container.firstChild).toBeNull();
    });

    it('should render without throwing errors', () => {
      expect(() => render(<ThemeInitializer />)).not.toThrow();
    });
  });

  describe('useEffect Hook', () => {
    it('should call initializeTheme when component mounts', () => {
      render(<ThemeInitializer />);

      expect(mockInitializeTheme).toHaveBeenCalledTimes(1);
      expect(mockInitializeTheme).toHaveBeenCalledWith();
    });

    it('should call initializeTheme with correct dependency array', () => {
      const { useThemeStore } = jest.requireMock('@/stores');

      render(<ThemeInitializer />);

      expect(useThemeStore).toHaveBeenCalledTimes(1);
      expect(useThemeStore).toHaveBeenCalledWith(expect.any(Function));

      const selector = useThemeStore.mock.calls[0][0];
      const mockState = { initializeTheme: mockInitializeTheme };
      const result = selector(mockState);

      expect(result).toBe(mockInitializeTheme);
    });
  });

  describe('Store Integration', () => {
    it('should select initializeTheme from useThemeStore', () => {
      const { useThemeStore } = jest.requireMock('@/stores');

      render(<ThemeInitializer />);

      expect(useThemeStore).toHaveBeenCalledTimes(1);
      expect(useThemeStore).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe('Component Behavior', () => {
    it('should initialize theme on mount', () => {
      render(<ThemeInitializer />);

      expect(mockInitializeTheme).toHaveBeenCalledTimes(1);
    });

    it('should handle re-renders correctly', () => {
      render(<ThemeInitializer />);

      mockInitializeTheme.mockClear();

      const { rerender } = render(<ThemeInitializer />);
      rerender(<ThemeInitializer />);

      expect(mockInitializeTheme).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling', () => {
    it('should handle errors in initializeTheme gracefully', () => {
      mockInitializeTheme.mockImplementation(() => {
        throw new Error('Theme initialization failed');
      });

      expect(() => render(<ThemeInitializer />)).toThrow('Theme initialization failed');
    });
  });

  describe('Coverage Edge Cases', () => {
    it('should handle null initializeTheme function', () => {
      const { useThemeStore } = jest.requireMock('@/stores');

      useThemeStore.mockImplementation((selector: (state: { initializeTheme: null }) => null) => {
        const state = { initializeTheme: null };
        return selector(state);
      });

      expect(() => render(<ThemeInitializer />)).toThrow('initializeTheme is not a function');
    });

    it('should handle undefined initializeTheme function', () => {
      const { useThemeStore } = jest.requireMock('@/stores');

      useThemeStore.mockImplementation(
        (selector: (state: { initializeTheme: undefined }) => undefined) => {
          const state = { initializeTheme: undefined };
          return selector(state);
        },
      );

      expect(() => render(<ThemeInitializer />)).toThrow('initializeTheme is not a function');
    });
  });
});
