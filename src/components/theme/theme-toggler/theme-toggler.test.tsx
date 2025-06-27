import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeToggle from './theme-toggler';

// Define proper types for the mocked components
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className: string;
  variant: string;
  size: string;
  [key: string]: unknown;
}

interface IconProps {
  className: string;
  [key: string]: unknown;
}

// Mock the dependencies
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className, variant, size, ...props }: ButtonProps) => (
    <button
      onClick={onClick}
      className={className}
      data-testid="theme-toggle-button"
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock('@/stores', () => ({
  useThemeStore: jest.fn(),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Sun: ({ className, ...props }: IconProps) => (
    <svg data-testid="sun-icon" className={className} {...props}>
      <title>Sun</title>
    </svg>
  ),
  Moon: ({ className, ...props }: IconProps) => (
    <svg data-testid="moon-icon" className={className} {...props}>
      <title>Moon</title>
    </svg>
  ),
}));

// Import mocked functions using ES6 imports
import { useThemeStore } from '@/stores';

const mockUseThemeStore = useThemeStore as jest.MockedFunction<typeof useThemeStore>;

describe('ThemeToggle', () => {
  const mockSetTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render the theme toggle button', () => {
      mockUseThemeStore.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      });

      render(<ThemeToggle />);

      const button = screen.getByTestId('theme-toggle-button');
      expect(button).toBeInTheDocument();
    });

    it('should render with correct button props', () => {
      mockUseThemeStore.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      });

      render(<ThemeToggle />);

      const button = screen.getByTestId('theme-toggle-button');
      expect(button).toHaveAttribute('data-variant', 'outline');
      expect(button).toHaveAttribute('data-size', 'icon');
    });

    it('should render sun and moon icons', () => {
      mockUseThemeStore.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      });

      render(<ThemeToggle />);

      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    });

    it('should render accessibility text', () => {
      mockUseThemeStore.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      });

      render(<ThemeToggle />);

      expect(screen.getByText('Toggle theme')).toBeInTheDocument();
      expect(screen.getByText('Toggle theme')).toHaveClass('sr-only');
    });
  });

  describe('Theme Toggle Functionality', () => {
    it('should call setTheme with "dark" when current theme is "light"', () => {
      mockUseThemeStore.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      });

      render(<ThemeToggle />);

      const button = screen.getByTestId('theme-toggle-button');
      fireEvent.click(button);

      expect(mockSetTheme).toHaveBeenCalledWith('dark');
      expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });

    it('should call setTheme with "light" when current theme is "dark"', () => {
      mockUseThemeStore.mockReturnValue({
        theme: 'dark',
        setTheme: mockSetTheme,
      });

      render(<ThemeToggle />);

      const button = screen.getByTestId('theme-toggle-button');
      fireEvent.click(button);

      expect(mockSetTheme).toHaveBeenCalledWith('light');
      expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should apply correct className to button', () => {
      mockUseThemeStore.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      });

      render(<ThemeToggle />);

      const button = screen.getByTestId('theme-toggle-button');
      expect(button).toHaveClass(
        'fixed top-4 right-4 z-50 focus-ring transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm',
      );
    });

    it('should render sun icon with correct classes for light theme', () => {
      mockUseThemeStore.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      });

      render(<ThemeToggle />);

      const sunIcon = screen.getByTestId('sun-icon');
      expect(sunIcon).toHaveClass(
        'h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0',
      );
    });

    it('should render moon icon with correct classes for light theme', () => {
      mockUseThemeStore.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      });

      render(<ThemeToggle />);

      const moonIcon = screen.getByTestId('moon-icon');
      expect(moonIcon).toHaveClass(
        'absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100',
      );
    });
  });

  describe('Conditional Logic Coverage', () => {
    it('should handle theme === "light" branch', () => {
      mockUseThemeStore.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      });

      render(<ThemeToggle />);

      const button = screen.getByTestId('theme-toggle-button');
      fireEvent.click(button);

      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });

    it('should handle theme !== "light" branch', () => {
      mockUseThemeStore.mockReturnValue({
        theme: 'dark',
        setTheme: mockSetTheme,
      });

      render(<ThemeToggle />);

      const button = screen.getByTestId('theme-toggle-button');
      fireEvent.click(button);

      expect(mockSetTheme).toHaveBeenCalledWith('light');
    });

    it('should handle other theme values (e.g., "system")', () => {
      mockUseThemeStore.mockReturnValue({
        theme: 'system',
        setTheme: mockSetTheme,
      });

      render(<ThemeToggle />);

      const button = screen.getByTestId('theme-toggle-button');
      fireEvent.click(button);

      expect(mockSetTheme).toHaveBeenCalledWith('light');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined theme gracefully', () => {
      mockUseThemeStore.mockReturnValue({
        theme: undefined,
        setTheme: mockSetTheme,
      });

      render(<ThemeToggle />);

      const button = screen.getByTestId('theme-toggle-button');
      fireEvent.click(button);

      expect(mockSetTheme).toHaveBeenCalledWith('light');
    });

    it('should handle null theme gracefully', () => {
      mockUseThemeStore.mockReturnValue({
        theme: null,
        setTheme: mockSetTheme,
      });

      render(<ThemeToggle />);

      const button = screen.getByTestId('theme-toggle-button');
      fireEvent.click(button);

      expect(mockSetTheme).toHaveBeenCalledWith('light');
    });

    it('should handle empty string theme gracefully', () => {
      mockUseThemeStore.mockReturnValue({
        theme: '',
        setTheme: mockSetTheme,
      });

      render(<ThemeToggle />);

      const button = screen.getByTestId('theme-toggle-button');
      fireEvent.click(button);

      expect(mockSetTheme).toHaveBeenCalledWith('light');
    });
  });

  describe('Integration Tests', () => {
    it('should render complete component structure', () => {
      mockUseThemeStore.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      });

      const { container } = render(<ThemeToggle />);

      // Check button exists
      expect(screen.getByTestId('theme-toggle-button')).toBeInTheDocument();

      // Check icons exist
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();

      // Check accessibility text exists
      expect(screen.getByText('Toggle theme')).toBeInTheDocument();

      // Check component structure without snapshot
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should maintain component state consistency', () => {
      const { rerender } = render(<ThemeToggle />);

      // Initial render with light theme
      mockUseThemeStore.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      });

      expect(screen.getByTestId('theme-toggle-button')).toBeInTheDocument();

      // Re-render with dark theme
      mockUseThemeStore.mockReturnValue({
        theme: 'dark',
        setTheme: mockSetTheme,
      });

      rerender(<ThemeToggle />);

      expect(screen.getByTestId('theme-toggle-button')).toBeInTheDocument();
    });
  });
});
