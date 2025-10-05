import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../providers/AuthProvider';
import { View, ActivityIndicator } from 'react-native';

export default function EventsScreen() {
  const { isAuthenticated } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    if (!isAuthenticated) {
      router.replace('/onboarding');
    } else {
      router.replace('/events');
    }
  }, [isAuthenticated, isReady]);

  return (
    <View className="flex-1 justify-center items-center bg-black">
      <ActivityIndicator size="large" color="#fdbf7b" />
    </View>
  );
}


