import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PasswordStrength from './password-strength';

// Mock the cn utility function
jest.mock('@/utils', () => ({
  cn: jest.fn((...classes) => classes.filter(Boolean).join(' ')),
}));

describe('PasswordStrength', () => {
  const defaultProps = {
    password: '',
    isVisible: true,
  };

  describe('Visibility', () => {
    it('should return null when isVisible is false', () => {
      const { container } = render(<PasswordStrength password="test" isVisible={false} />);
      expect(container.firstChild).toBeNull();
    });

    it('should render component when isVisible is true', () => {
      render(<PasswordStrength {...defaultProps} />);
      expect(screen.getByText('Password requirements:')).toBeInTheDocument();
    });
  });

  describe('Password Requirements', () => {
    it('should show all requirements with X icons for empty password', () => {
      render(<PasswordStrength {...defaultProps} />);

      expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
      expect(screen.getByText('One uppercase letter')).toBeInTheDocument();
      expect(screen.getByText('One lowercase letter')).toBeInTheDocument();
      expect(screen.getByText('One number')).toBeInTheDocument();
      expect(screen.getByText('One special character')).toBeInTheDocument();

      // All should show X icons (failed requirements)
      expect(screen.getAllByTestId('x-icon')).toHaveLength(5);
      expect(screen.queryAllByTestId('check-icon')).toHaveLength(0);
    });

    it('should show check icon for length requirement when password is 8+ characters', () => {
      render(<PasswordStrength password="12345678" isVisible={true} />);

      const checkIcons = screen.getAllByTestId('check-icon');
      const xIcons = screen.getAllByTestId('x-icon');

      expect(checkIcons).toHaveLength(2); // lenght and number
      expect(xIcons).toHaveLength(3); // Other 4 requirements not met
    });

    it('should show check icon for uppercase requirement', () => {
      render(<PasswordStrength password="A" isVisible={true} />);

      const checkIcons = screen.getAllByTestId('check-icon');
      expect(checkIcons).toHaveLength(1); // Only uppercase requirement met
    });

    it('should show check icon for lowercase requirement', () => {
      render(<PasswordStrength password="a" isVisible={true} />);

      const checkIcons = screen.getAllByTestId('check-icon');
      expect(checkIcons).toHaveLength(1); // Only lowercase requirement met
    });

    it('should show check icon for number requirement', () => {
      render(<PasswordStrength password="1" isVisible={true} />);

      const checkIcons = screen.getAllByTestId('check-icon');
      expect(checkIcons).toHaveLength(1); // Only number requirement met
    });

    it('should show check icon for special character requirement', () => {
      render(<PasswordStrength password="!" isVisible={true} />);

      const checkIcons = screen.getAllByTestId('check-icon');
      expect(checkIcons).toHaveLength(1); // Only special character requirement met
    });

    it('should show all check icons for strong password', () => {
      render(<PasswordStrength password="StrongPass123!" isVisible={true} />);

      const checkIcons = screen.getAllByTestId('check-icon');
      const xIcons = screen.queryAllByTestId('x-icon');

      expect(checkIcons).toHaveLength(5); // All requirements met
      expect(xIcons).toHaveLength(0); // No failed requirements
    });

    it('should show mixed icons for partially strong password', () => {
      render(<PasswordStrength password="Password" isVisible={true} />);

      const checkIcons = screen.queryAllByTestId('check-icon');
      const xIcons = screen.getAllByTestId('x-icon');

      expect(checkIcons).toHaveLength(3); // Length, uppercase and lowercase met
      expect(xIcons).toHaveLength(2); // Number and special character not met
    });
  });

  describe('CSS Classes and Styling', () => {
    it('should apply correct CSS classes to container', () => {
      const { container } = render(<PasswordStrength {...defaultProps} />);
      const containerDiv = container.firstChild as HTMLElement;

      expect(containerDiv).toHaveClass(
        'mt-2',
        'space-y-2',
        'rounded-md',
        'border',
        'p-3',
        'bg-purple-muted',
        'border-purple-muted',
        'animate-fade-in',
      );
    });

    it('should apply correct CSS classes to title', () => {
      render(<PasswordStrength {...defaultProps} />);
      const title = screen.getByText('Password requirements:');

      expect(title).toHaveClass('text-sm', 'font-medium', 'text-primary');
    });

    it('should apply correct CSS classes to requirement items', () => {
      render(<PasswordStrength password="StrongPass123!" isVisible={true} />);

      const requirementItems = screen.getAllByText(/At least|One/);
      requirementItems.forEach(item => {
        expect(item.parentElement).toHaveClass(
          'flex',
          'items-center',
          'gap-2',
          'text-sm',
          'transition-all',
          'duration-200',
        );
      });
    });

    it('should apply success styles to valid requirements', () => {
      render(<PasswordStrength password="A" isVisible={true} />);

      const uppercaseRequirement = screen.getByText('One uppercase letter');
      expect(uppercaseRequirement).toHaveClass(
        'transition-colors',
        'duration-200',
        'text-primary',
        'font-medium',
      );
    });

    it('should apply default styles to invalid requirements', () => {
      render(<PasswordStrength password="A" isVisible={true} />);

      const lengthRequirement = screen.getByText('At least 8 characters');
      expect(lengthRequirement).toHaveClass(
        'transition-colors',
        'duration-200',
        'text-muted-foreground',
      );
    });
  });

  describe('Icon Styling', () => {
    it('should apply correct classes to check icons', () => {
      render(<PasswordStrength password="StrongPass123!" isVisible={true} />);

      const checkIcons = screen.getAllByTestId('check-icon');
      checkIcons.forEach(icon => {
        expect(icon).toHaveClass('h-4', 'w-4', 'text-green-500', 'animate-fade-in');
      });
    });

    it('should apply correct classes to X icons', () => {
      render(<PasswordStrength password="" isVisible={true} />);

      const xIcons = screen.getAllByTestId('x-icon');
      xIcons.forEach(icon => {
        expect(icon).toHaveClass('h-4', 'w-4', 'text-muted-foreground');
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle passwords with only special characters', () => {
      render(<PasswordStrength password="!@#$%^&*()" isVisible={true} />);

      const checkIcons = screen.getAllByTestId('check-icon');
      expect(checkIcons).toHaveLength(2); // Length and special character requirements
    });

    it('should handle passwords with numbers and special characters', () => {
      render(<PasswordStrength password="123!@#" isVisible={true} />);

      const checkIcons = screen.getAllByTestId('check-icon');
      expect(checkIcons).toHaveLength(2); // Number and special character requirements
    });

    it('should handle very long passwords', () => {
      const longPassword = 'A'.repeat(100) + 'a1!';
      render(<PasswordStrength password={longPassword} isVisible={true} />);

      const checkIcons = screen.getAllByTestId('check-icon');
      expect(checkIcons).toHaveLength(5); // All requirements should be met
    });

    it('should handle passwords with unicode characters', () => {
      render(<PasswordStrength password="Pässwörd123!" isVisible={true} />);

      const checkIcons = screen.getAllByTestId('check-icon');
      expect(checkIcons).toHaveLength(5); // All requirements should be met
    });
  });

  describe('Requirements Array', () => {
    it('should render all 5 requirements', () => {
      render(<PasswordStrength {...defaultProps} />);

      const requirements = [
        'At least 8 characters',
        'One uppercase letter',
        'One lowercase letter',
        'One number',
        'One special character',
      ];

      requirements.forEach(requirement => {
        expect(screen.getByText(requirement)).toBeInTheDocument();
      });
    });

    it('should use correct key for each requirement item', () => {
      const { container } = render(<PasswordStrength {...defaultProps} />);

      const requirementItems = container.querySelectorAll('.flex.items-center.gap-2');
      expect(requirementItems).toHaveLength(5);
    });
  });
});
