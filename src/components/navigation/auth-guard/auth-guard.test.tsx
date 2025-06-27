import { render } from '@testing-library/react';
import AuthGuard from './auth-guard';

describe('AuthGuard', () => {
  it('renders children when authenticated', () => {
    // Simula usuário autenticado
    localStorage.setItem('userToken', 'fake-token');
    const { getByText } = render(
      <AuthGuard>
        <div>Conteúdo protegido</div>
      </AuthGuard>,
    );
    expect(getByText('Conteúdo protegido')).toBeInTheDocument();
    localStorage.removeItem('userToken');
  });
});
