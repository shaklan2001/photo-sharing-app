import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../providers/AuthProvider';
import SplashScreen from './splash';
import { useUpdates } from '../hooks/useUpdates';

export default function AuthCheckScreen() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const { checkForUpdates } = useUpdates();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    checkForUpdates();

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady || isLoading) return;
    
    if (!isAuthenticated) {
      router.replace('/onboarding');
    } else {
      router.replace('/events');
    }
  }, [isAuthenticated, isReady, isLoading]);

  return (
    <SplashScreen />
  );
}


