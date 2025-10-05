import { useEffect } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../providers/AuthProvider';

export default function Entry() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    router.replace('/splash');
  }, []);

  return null;
}


