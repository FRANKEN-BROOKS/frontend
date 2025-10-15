'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { UserRole } from '@/types';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requireAuth?: boolean;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  requireAuth = true,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If authentication is required but user is not authenticated
      if (requireAuth && !isAuthenticated) {
        router.push('/login');
        return;
      }

      // If a specific role is required but user doesn't have it
      if (requiredRole && user && user.role !== requiredRole && user.role !== UserRole.ADMIN) {
        router.push('/dashboard');
        return;
      }
    }
  }, [loading, isAuthenticated, user, requireAuth, requiredRole, router]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  // If not authenticated and authentication is required, don't render anything
  // (will redirect in useEffect)
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // If role is required but user doesn't have it, don't render anything
  if (requiredRole && user && user.role !== requiredRole && user.role !== UserRole.ADMIN) {
    return null;
  }

  return <>{children}</>;
}