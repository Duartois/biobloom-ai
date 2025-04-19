
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireOnboarding = false 
}) => {
  const { isAuthenticated, loading, needsOnboarding } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if we're not in a loading state
    if (!loading) {
      // Se autenticado e precisando de onboarding, redirecionar para onboarding
      // Mas apenas se não estiver já na página de onboarding
      if (isAuthenticated && 
          needsOnboarding && 
          location.pathname !== '/onboarding') {
        navigate('/onboarding', { replace: true });
        return;
      }

      // Se já completou onboarding e estiver tentando acessar /onboarding, redirecionar para dashboard
      if (isAuthenticated && 
          !needsOnboarding && 
          location.pathname === '/onboarding') {
        navigate('/dashboard', { replace: true });
        return;
      }
    }
  }, [isAuthenticated, needsOnboarding, loading, navigate, location.pathname]);

  // Show loading state while checking authentication - with timeout protection
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Save the location the user was trying to visit
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;
