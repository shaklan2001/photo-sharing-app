import { Link } from 'expo-router'
import { useRef, memo, useState, useEffect } from 'react'
import { Text, ActivityIndicator, FlatList, Pressable, View, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../providers/TokenAuthProvider'
import { useQuery } from '@tanstack/react-query'
import { getEvents } from '../services/events'
import { getAssetsForEvent } from '../services/assets'
import Ionicons from '@expo/vector-icons/Ionicons'
import { LinearGradient } from 'expo-linear-gradient'
import AssetItem from '../components/AssetItem'
import { router } from 'expo-router'

// Thin Header Component
const ThinHeader = memo(() => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<{
    full_name?: string | null;
    avatar_url?: string | null;
    username?: string | null;
  } | null>(null);

  useEffect(() => {
    // Skip profile fetching since we're using token-based auth
  }, [user]);

  const getUserDisplayName = () => {
    // Use user data from token auth provider
    if (user?.full_name) {
      return user.full_name;
    }
    
    // Check database profile as fallback
    if (userProfile?.full_name) {
      return userProfile.full_name;
    }
    
    return 'Anonymous User';
  };

  return (
    <View className='flex-row items-center justify-between px-4 py-2 bg-white border-b border-[#ffe9e7]'>
      {/* Left side - Logo and App Name */}
      <View className='flex-row items-center'>
        <View className='w-12 h-12 rounded-lg items-center justify-center'>
          <Image source={require('../../assets/icon.png')} className='w-8 h-8' />
        </View>
        <Text className='text-xl font-bold text-gray-800'>SnapHive</Text>
      </View>

      {/* Right side - User Profile */}
      <Pressable 
        onPress={() => router.push('/profile')}
        className='flex-row items-center'
      >
        <View className='w-8 h-8 rounded-full bg-gradient-to-br from-[#fdbf7b] to-[#fed194] items-center justify-center mr-2'>
          <Text className='text-sm font-bold text-white'>
            {getUserDisplayName().charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text className='text-sm font-medium text-gray-700'>
          {getUserDisplayName()}
        </Text>
        <Ionicons name='chevron-down' size={16} color='#666' className='ml-1' />
      </Pressable>
    </View>
  );
});

ThinHeader.displayName = 'ThinHeader';

// Event Card Component
const EventCard = memo(({ event }: { event: any }) => {
  const { data: assets } = useQuery({
    queryKey: ['assets', event.id],
    queryFn: () => getAssetsForEvent(event.id),
  });

  const firstAsset = assets && assets.length > 0 ? assets[0] : null;

  return (
    <Link href={`/events/${event.id}`} asChild>
      <Pressable className='bg-white rounded-2xl shadow-xl border border-[#ffe9e7] p-4'>
        <View className='flex-row items-center'>
          <View className='w-24 h-24 rounded-lg overflow-hidden mr-4'>
            {firstAsset ? (
              <AssetItem asset={firstAsset} isEventList={true} />
            ) : (
              <View className='w-full h-full bg-gray-200 items-center justify-center'>
                <Ionicons name='image-outline' size={24} color='#fdbf7b' />
              </View>
            )}
          </View>
          
          {/* Event Details */}
          <View className='flex-1'>
            <Text className='text-xl font-bold text-gray-800 mb-1'>
              {event.name || 'Untitled Event'}
            </Text>
            <Text className='text-ms text-gray-500 mb-2'>
              {new Date(event.created_at).toLocaleDateString()}
            </Text>
            
            {/* Participants */}
            {/* <View className='flex-row items-center'>
              <View className='flex-row -space-x-2'>
                <View className='w-6 h-6 rounded-full bg-gray-300 border-2 border-white' />
                <View className='w-6 h-6 rounded-full bg-gray-300 border-2 border-white' />
                <View className='w-6 h-6 rounded-full bg-gray-300 border-2 border-white' />
                <View className='w-6 h-6 rounded-full bg-[#fdbf7b] border-2 border-white items-center justify-center'>
                  <Text className='text-xs font-bold text-white'>
                    +5
                  </Text>
                </View>
              </View>
            </View> */}
          </View>
          
          {/* Photo Count */}
          <View className='items-end'>
            <Text className='text-sm text-gray-500 mb-1'>
              {assets?.length || 0} photos
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
});

EventCard.displayName = 'EventCard';

// No Events Screen Component
const NoEventsScreen = memo(() => (
  <View className='flex-1 justify-center items-center px-8'>
    <View className='items-center mb-8'>
      <View className='w-24 h-24 rounded-full bg-gray-100 items-center justify-center mb-6'>
        <Ionicons name='calendar-outline' size={48} color='#fdbf7b' />
      </View>
      
      <Text className='text-2xl font-bold text-gray-800 text-center mb-3'>
        No Events Yet
      </Text>
      
      <Text className='text-gray-500 text-center text-base leading-6'>
        You don't have any events yet.{'\n'}
        Create a new event or join an existing one to start sharing memories!
      </Text>
    </View>

    <View className='w-full gap-4'>
      {/* Create Event Button */}
      <Link href='/events/create' asChild>
        <Pressable>
          <LinearGradient
            colors={['#fdbf7b', '#fed194']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name='add-circle-outline' size={24} color='#333' />
            <Text className='text-[#333] text-lg font-bold ml-2'>
              Create New Event
            </Text>
          </LinearGradient>
        </Pressable>
      </Link>

      {/* Join Event Button */}
      <Pressable 
        className='bg-gray-100 p-4 rounded-2xl flex-row items-center justify-center'
        onPress={() => {
          // TODO: Implement QR scanner functionality
          console.log('QR Scanner functionality to be implemented');
        }}
      >
        <Ionicons name='qr-code-outline' size={24} color='#666' />
        <Text className='text-gray-600 text-lg font-bold ml-2'>
          Join Event with QR Code
        </Text>
      </Pressable>
    </View>
  </View>
));

NoEventsScreen.displayName = 'NoEventsScreen';

export default function EventsScreen () {
  const { user, isAuthenticated } = useAuth()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  })

  if (isLoading) {
    return (
      <SafeAreaView className='flex-1 bg-white'>
        <ThinHeader />
        <View className='flex-1 justify-center items-center'>
          <ActivityIndicator size="large" color="#fdbf7b" />
        </View>
      </SafeAreaView>
    )
  }

  if (isError) {
    return (
      <SafeAreaView className='flex-1 bg-white'>
        <ThinHeader />
        <View className='flex-1 justify-center items-center'>
          <Text className='text-gray-600 text-lg'>Error: {String(isError)}</Text>
        </View>
      </SafeAreaView>
    )
  }
  

  // Show no events screen if no events exist
  if (!data || data.length === 0) {
    return (
      <SafeAreaView className='flex-1 bg-white'>
        <ThinHeader />
        <NoEventsScreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-white'>
      {/* Thin Header */}
      <ThinHeader />
      
      <View className='flex-1 px-4 pt-4'>
        <Link href='/events/create' asChild>
          <Pressable className='mb-6'>
            <LinearGradient
              colors={['#fdbf7b', '#fed194']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ padding: 20, borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
            >
              <Ionicons name='add-outline' size={26} color='#333' />
              <Text className='text-[#333] text-xl font-bold ml-2'>
                Create New Event
              </Text>
            </LinearGradient>
          </Pressable>
        </Link>

        <View className='flex-1'>
          <View className='flex-row items-center mb-4'>
            <Ionicons name='time' size={24} color='#fdbf7b' />
            <Text className='text-xl font-bold text-gray-800 ml-2'>
              All Events
            </Text>
          </View>

          <FlatList
            data={data}
            contentContainerClassName='gap-4'
            renderItem={({ item }) => <EventCard event={item} />}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className='h-2' />}
          />
        </View>
      </View>
    </SafeAreaView>
  )
}
