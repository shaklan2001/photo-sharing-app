import {
  View,
  Text,
  ActivityIndicator,
  Pressable,
  FlatList,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useLocalSearchParams, router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { artisticFilter } from "@cloudinary/url-gen/actions/effect";
import { getEvent } from "../../../services/events";
import { cloudinary } from "../../../lib/cloudinary";
import { Galeria } from "@nandorojo/galeria";
import AssetItem from "../../../components/AssetItem";
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState, memo } from 'react';

// Header Button Component
const HeaderButton = memo(({ onPress, iconName, href }: { onPress?: () => void, iconName: string, href?: string }) => {
  const buttonContent = (
    <LinearGradient
      colors={['#fdbf7b', '#fed194']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}
    >
      <Ionicons name={iconName as any} size={20} color="white" />
    </LinearGradient>
  );

  if (href) {
    return (
      <Link href={href} asChild>
        <Pressable>{buttonContent}</Pressable>
      </Link>
    );
  }

  return (
    <Pressable onPress={onPress}>
      {buttonContent}
    </Pressable>
  );
});

HeaderButton.displayName = 'HeaderButton';

// Toggle Tab Component
const ToggleTab = memo(({ 
  isActive, 
  onPress, 
  iconName, 
  label 
}: { 
  isActive: boolean, 
  onPress: () => void, 
  iconName: string, 
  label: string 
}) => (
  <Pressable onPress={onPress} className='flex-1'>
    <LinearGradient
      colors={isActive ? ['#fdbf7b', '#fed194'] : ['transparent', 'transparent']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ padding: 12, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
    >
      <Ionicons 
        name={iconName as any} 
        size={20} 
        color={isActive ? 'white' : '#666'} 
      />
      <Text className={`ml-2 font-bold ${
        isActive ? 'text-white' : 'text-gray-600'
      }`}>
        {label}
      </Text>
    </LinearGradient>
  </Pressable>
));

ToggleTab.displayName = 'ToggleTab';

const FloatingCameraButton = memo(({ eventId, floatingAnim }: { eventId: string, floatingAnim: Animated.Value }) => (
  <Animated.View
    style={{
      transform: [{ translateY: floatingAnim }],
    }}
    className='absolute bottom-8 right-4'
  >
    <Link href={`/events/${eventId}/camera`} asChild>
      <Pressable>
        <LinearGradient
          colors={['#fdbf7b', '#fed194']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: 64, height: 64, borderRadius: 50, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="camera" size={32} color="white" />
        </LinearGradient>
      </Pressable>
    </Link>
  </Animated.View>
));

FloatingCameraButton.displayName = 'FloatingCameraButton';

// Empty State Component
const EmptyState = memo(({ type }: { type: 'photos' | 'videos' }) => (
  <View className='flex-1 justify-center items-center'>
    <Ionicons 
      name={type === 'photos' ? "camera-outline" : "videocam-outline"} 
      size={64} 
      color="#fdbf7b" 
    />
    <Text className='text-xl font-bold text-gray-600 mt-4'>
      No {type === 'photos' ? 'Photos' : 'Videos'} Yet
    </Text>
    <Text className='text-gray-500 text-center mt-2'>
      Start {type === 'photos' ? 'capturing memories by taking photos' : 'recording videos to capture the moment'}
    </Text>
  </View>
));

EmptyState.displayName = 'EmptyState';

export default function EventDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const floatingAnim = useRef(new Animated.Value(0)).current;

  const {
    data: event,
    isLoading,
    error,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["events", id],
    queryFn: () => getEvent(id),
  });

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    animate();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 bg-white'>
        <View className='flex-1 justify-center items-center'>
          <ActivityIndicator size="large" color="#fdbf7b" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className='flex-1 bg-white'>
        <View className='flex-1 justify-center items-center'>
          <Text className='text-gray-600 text-lg'>Error: {error.message}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView className='flex-1 bg-white'>
        <View className='flex-1 justify-center items-center'>
          <Text className='text-gray-600 text-lg'>Event not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const photos = event.assets || [];
  const videos: any[] = [];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className='flex-1 bg-white'>
        <View className='flex-row items-center justify-between px-4 py-3'>
          <HeaderButton 
            onPress={() => router.back()} 
            iconName="arrow-back" 
          />
          
          <Text className='text-xl font-bold text-gray-800 flex-1 text-center mx-4'>
            {event.name || 'Event'}
          </Text>
          
          <HeaderButton 
            href={`/events/${id || ''}/share`} 
            iconName="share-outline" 
          />
        </View>

        {/* Photos/Videos Toggle */}
        <View className='px-4 mb-6'>
          <View className='bg-gray-200 rounded-3xl p-[6px] flex-row'>
            <ToggleTab
              isActive={activeTab === 'photos'}
              onPress={() => setActiveTab('photos')}
              iconName="camera"
              label="Photos"
            />
            
            <ToggleTab
              isActive={activeTab === 'videos'}
              onPress={() => setActiveTab('videos')}
              iconName="videocam-outline"
              label="Videos"
            />
          </View>
        </View>

        {/* Content */}
        <View className='flex-1 px-4'>
          {activeTab === 'photos' ? (
            photos.length > 0 ? (
              <FlatList
                data={photos}
                numColumns={2}
                contentContainerClassName="gap-2"
                columnWrapperClassName="gap-2"
                renderItem={({ item }) => (
                  <View className="flex-1">
                    <AssetItem asset={item} />
                  </View>
                )}
                showsVerticalScrollIndicator={false}
                refreshing={isRefetching}
                onRefresh={refetch}
              />
            ) : (
              <EmptyState type="photos" />
            )
          ) : (
            videos.length > 0 ? (
              <FlatList
                data={videos}
                numColumns={2}
                contentContainerClassName="gap-2"
                columnWrapperClassName="gap-2"
                renderItem={({ item }) => (
                  <View className="flex-1">
                    <AssetItem asset={item} />
                  </View>
                )}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <EmptyState type="videos" />
            )
          )}
        </View>

        {/* Floating Camera Button */}
        <FloatingCameraButton eventId={id || ''} floatingAnim={floatingAnim} />
      </SafeAreaView>
    </>
  );
}
