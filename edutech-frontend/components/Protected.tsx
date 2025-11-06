"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type ProtectedProps = {
  children: React.ReactNode;
  /** Optional array of allowed roles (e.g. ['student','teacher']). If omitted, any authenticated user is allowed. */
  allowedRoles?: string[];
};

/**
 * Protected wrapper for client pages.
 * - Redirects to /login if user is not authenticated
 * - If allowedRoles is provided, only allows users whose role is included
 */
const Protected: React.FC<ProtectedProps> = ({ children, allowedRoles }) => {
  const { token, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // If there's no token, send to login
      if (!token) {
        router.push('/login');
        return;
      }

      // If allowedRoles provided, verify user role
      if (allowedRoles && allowedRoles.length > 0) {
        const role = (user as any)?.role;
        if (!role || !allowedRoles.includes(role)) {
          // unauthorized: redirect to home or show message
          router.push('/');
        }
      }
    }
  }, [token, user, isLoading, allowedRoles, router]);

  // While auth state is loading, show a spinner to avoid flicker
  if (isLoading || !token) {
    return (
      <div className="flex items-center justify-center h-56">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default Protected;
