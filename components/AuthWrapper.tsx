import { useAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import React from 'react';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/sign-in' as any);
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return <>{children}</>;
}
