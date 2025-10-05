import React, { useState } from 'react';
import { Image, View, Text, Platform, ActivityIndicator } from 'react-native';

interface AndroidImageProps {
  source: { uri: string };
  className?: string;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  onError?: (error: any) => void;
  onLoad?: () => void;
  fallbackUri?: string;
}

export default function AndroidImage({ 
  source, 
  className, 
  resizeMode = 'cover',
  onError,
  onLoad,
  fallbackUri
}: AndroidImageProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSource, setCurrentSource] = useState(source);

  const handleError = (error: any) => {
    if (fallbackUri && currentSource.uri === source.uri) {
      setCurrentSource({ uri: fallbackUri });
      setIsLoading(true);
      return;
    }
    
    setImageError(true);
    setIsLoading(false);
    onError?.(error);
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  if (imageError) {
    return (
      <View className={`${className} bg-gray-600 items-center justify-center`}>
        <Text className="text-white text-xs">Failed to load</Text>
      </View>
    );
  }

  return (
    <View className={className}>
      {isLoading && (
        <View className="absolute inset-0 bg-gray-600 items-center justify-center z-10">
          <ActivityIndicator />
        </View>
      )}
      <Image
        source={currentSource}
        className="flex-1 w-full h-full"
        resizeMode={resizeMode}
        onError={handleError}
        onLoad={handleLoad}
        fadeDuration={0}
        progressiveRenderingEnabled={true}
      />
    </View>
  );
}
