import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import ThemeToggle from './theme-toggler';

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
      expect(button).toHaveAttribute('data-variant', 'secondary');
      expect(button).toHaveAttribute('data-size', 'sm');
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
        'focus-ring transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg',
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

    it('should handle theme === "dark" branch', () => {
      mockUseThemeStore.mockReturnValue({
        theme: 'dark',
        setTheme: mockSetTheme,
      });

      render(<ThemeToggle />);

      const button = screen.getByTestId('theme-toggle-button');
      fireEvent.click(button);

      expect(mockSetTheme).toHaveBeenCalledWith('light');
    });
  });

  describe('Props Handling', () => {
    it('should accept custom className prop', () => {
      mockUseThemeStore.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      });

      render(<ThemeToggle className="custom-class" />);

      const button = screen.getByTestId('theme-toggle-button');
      expect(button).toHaveClass('custom-class');
    });

    it('should accept custom variant prop', () => {
      mockUseThemeStore.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      });

      render(<ThemeToggle variant="outline" />);

      const button = screen.getByTestId('theme-toggle-button');
      expect(button).toHaveAttribute('data-variant', 'outline');
    });

    it('should use default variant when not provided', () => {
      mockUseThemeStore.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      });

      render(<ThemeToggle />);

      const button = screen.getByTestId('theme-toggle-button');
      expect(button).toHaveAttribute('data-variant', 'secondary');
    });
  });

  describe('Component Integration', () => {
    it('should integrate with theme store correctly', () => {
      mockUseThemeStore.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      });

      render(<ThemeToggle />);

      expect(mockUseThemeStore).toHaveBeenCalled();
    });

    it('should handle theme store updates', () => {
      const { rerender } = render(<ThemeToggle />);

      mockUseThemeStore.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      });

      rerender(<ThemeToggle />);

      const button = screen.getByTestId('theme-toggle-button');
      fireEvent.click(button);

      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility attributes', () => {
      mockUseThemeStore.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      });

      render(<ThemeToggle />);

      const button = screen.getByTestId('theme-toggle-button');
      expect(button).toBeInTheDocument();
      expect(screen.getByText('Toggle theme')).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      mockUseThemeStore.mockReturnValue({
        theme: 'light',
        setTheme: mockSetTheme,
      });

      render(<ThemeToggle />);

      const button = screen.getByTestId('theme-toggle-button');
      button.focus();
      expect(button).toHaveFocus();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing theme store gracefully', () => {
      mockUseThemeStore.mockReturnValue({
        theme: undefined as unknown as string,
        setTheme: mockSetTheme,
      });

      expect(() => render(<ThemeToggle />)).not.toThrow();
    });

    it('should handle missing setTheme function gracefully', () => {
      mockUseThemeStore.mockReturnValue({
        theme: 'light',
        setTheme: undefined as unknown as (theme: string) => void,
      });

      expect(() => render(<ThemeToggle />)).not.toThrow();
    });
  });
});
