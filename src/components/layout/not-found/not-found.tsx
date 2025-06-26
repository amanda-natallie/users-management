import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import ROUTES from '@/constants/routes';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-background"
      data-testid="not-found"
    >
      <Card className="w-full max-w-md" data-testid="card">
        <CardHeader className="text-center" data-testid="card-header">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" data-testid="alert-triangle-icon" />
          </div>
          <CardTitle className="text-2xl font-bold" data-testid="card-title">
            Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4" data-testid="card-content">
          <p className="text-muted-foreground">
            Sorry, the page you are looking for doesn't exist.
          </p>
          <Button onClick={handleGoToDashboard} className="w-full" data-testid="button">
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
