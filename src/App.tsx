import { FullscreenLoader, NotFound } from '@/components/layout';
import { AuthGuard } from '@/components/navigation';
import ROUTES from '@/constants/routes';
import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router';

const AuthPage = lazy(() => import('./pages/auth/auth'));
const DashboardPage = lazy(() => import('./pages/dashboard/dashboard'));

function App() {
  return (
    <Suspense fallback={<FullscreenLoader />}>
      <Routes>
        <Route path={ROUTES.AUTH} element={<AuthPage />} />
        <Route
          path={ROUTES.HOME}
          element={
            <AuthGuard>
              <DashboardPage />
            </AuthGuard>
          }
        />
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
