import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router';
import { AuthGuard, NotFound, FullscreenLoader } from '@/components/layout';
import ROUTES from '@/constants/routes';

// Lazy load pages
const AuthPage = lazy(() => import('./pages/auth/auth'));
const DashboardPage = lazy(() => import('./pages/dashboard/dashboard'));

function App() {
  return (
    <Suspense fallback={<FullscreenLoader />}>
      <Routes>
        {/* Public route */}
        <Route path={ROUTES.AUTH} element={<AuthPage />} />

        {/* Protected route */}
        <Route
          path={ROUTES.HOME}
          element={
            <AuthGuard>
              <DashboardPage />
            </AuthGuard>
          }
        />

        {/* 404 Not Found */}
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
