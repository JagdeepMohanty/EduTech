"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, CircularProgress, Box } from '@mui/material';
import { useAuth } from '@/context/AuthContext';

type ProtectedProps = {
  children: React.ReactNode;
  allowedRoles?: string[];
};

const Protected: React.FC<ProtectedProps> = ({ children, allowedRoles }) => {
  const { token, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!token) {
        router.push('/login');
        return;
      }

      if (allowedRoles && allowedRoles.length > 0) {
        const role = (user as any)?.role;
        if (!role || !allowedRoles.includes(role)) {
          router.push('/');
        }
      }
    }
  }, [token, user, isLoading, allowedRoles, router]);

  if (isLoading || !token) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return <>{children}</>;
};

export default Protected;