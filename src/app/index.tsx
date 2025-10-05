import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../providers/AuthProvider';

export default function EventsScreen() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/onboarding');
    } else {
      router.replace('/events');
    }
  }, [isAuthenticated]);

  return null;
}


