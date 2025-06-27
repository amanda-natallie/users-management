import { useState } from 'react';
import { SignInForm, SignUpForm } from './components';
import { MainLayout } from '@/components/layout';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleFlip = (toSignUp: boolean) => {
    setIsFlipping(true);
    setTimeout(() => {
      setIsSignUp(toSignUp);
      setIsFlipping(false);
    }, 150);
  };

  return (
    <MainLayout dataTestId="auth-page">
      {isSignUp ? (
        <SignUpForm onSwitchToSignIn={() => handleFlip(false)} isFlipping={isFlipping} />
      ) : (
        <SignInForm onSwitchToSignUp={() => handleFlip(true)} isFlipping={isFlipping} />
      )}
    </MainLayout>
  );
};

export default AuthPage;
