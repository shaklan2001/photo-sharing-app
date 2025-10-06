import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { useAuth } from '../providers/AuthProvider';
import SplashScreen from './splash';
import { useUpdates } from '../hooks/useUpdates';
import { logger } from '../utils/logger';

export default function AuthCheckScreen() {
  logger.debug('🚀 App starting - AuthCheckScreen loaded');
  
  const { isAuthenticated, isLoading } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const { checkForUpdates } = useUpdates();

  useEffect(() => {
    logger.debug('📱 App initialization starting');
    
    const timer = setTimeout(() => {
      logger.debug('⏰ App ready timer completed');
      setIsReady(true);
    }, 100);

    logger.debug('🔄 Checking for updates...');
    checkForUpdates();

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    logger.debug('🔍 Auth check effect triggered', { 
      isReady, 
      isLoading, 
      isAuthenticated 
    });
    
    if (!isReady || isLoading) {
      logger.debug('⏳ Waiting for app to be ready or auth to load');
      return;
    }
    
    if (!isAuthenticated) {
      logger.debug('🔐 User not authenticated - redirecting to onboarding');
      router.replace('/onboarding');
    } else {
      logger.debug('✅ User authenticated - redirecting to events');
      router.replace('/events');
    }
  }, [isAuthenticated, isReady, isLoading]);

  return (
    <SplashScreen />
  );
}


