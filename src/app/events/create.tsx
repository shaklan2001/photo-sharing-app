import { useState } from 'react';
import { View, TextInput, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useAuth } from '../../providers/AuthProvider';
import { createEvent } from '../../services/events';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router';

export default function CreateEvent() {
  const [name, setName] = useState('');
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const createEventMutation = useMutation({
    mutationFn: () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return createEvent({ name, owner_id: user.id }, user.id);
    },
    onSuccess: (data) => {
      setName('');
      queryClient.invalidateQueries({ queryKey: ['events'] });
      console.log('Event created successfully:', data);
      router.replace(`/events/${data.id}`);
    },
    onError: (error) => {
      console.error('Error creating event:', error);
    },
  });

  if (!isAuthenticated || !user) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView className='flex-1 bg-white justify-center items-center'>
          <Text className='text-gray-600 text-lg'>Loading...</Text>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      
      <SafeAreaView className='flex-1 bg-white'>
        {/* Custom Header */}
        <View className='flex-row items-center justify-between px-4 py-3'>
          <Pressable onPress={() => router.back()}>
            <LinearGradient
              colors={['#fdbf7b', '#fed194']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </LinearGradient>
          </Pressable>
          
          <Text className='text-xl font-bold text-gray-800 flex-1 text-center mx-4'>
            Create Event
          </Text>
          
          <View style={{ width: 40 }} />
        </View>

        <View className='flex-1 px-6 pt-8'>
          <View className='mb-8'>
            <Text className='text-2xl font-bold text-gray-800 mb-2'>
              Create New Event
            </Text>
            <Text className='text-gray-500 text-base'>
              Give your event a memorable name and start sharing memories with friends and family.
            </Text>
          </View>

          <View className='mb-8'>
            <Text className='text-lg font-semibold text-gray-700 mb-3'>
              Event Name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder='Enter event name...'
              className='bg-gray-50 p-4 rounded-2xl text-gray-800 text-lg border border-gray-200'
              placeholderTextColor='#9CA3AF'
              style={{ fontSize: 16 }}
            />
          </View>

          {/* Error Display */}
          {createEventMutation.isError && (
            <View className='mb-4 p-4 bg-red-50 rounded-2xl border border-red-200'>
              <Text className='text-red-600 text-center font-medium'>
                {createEventMutation.error?.message || 'Failed to create event. Please try again.'}
              </Text>
            </View>
          )}

          <View className='flex-1 justify-end pb-8'>
            <Pressable
              onPress={() => createEventMutation.mutate()}
              disabled={!name.trim() || createEventMutation.isPending}
              className={`${!name.trim() || createEventMutation.isPending ? 'opacity-50' : ''}`}
            >
              <LinearGradient
                colors={['#fdbf7b', '#fed194']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ 
                  padding: 18, 
                  borderRadius: 20, 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                {createEventMutation.isPending ? (
                  <>
                    <Ionicons name="hourglass-outline" size={24} color="#333" />
                    <Text className='text-[#333] text-xl font-bold ml-2'>
                      Creating...
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="add-circle-outline" size={24} color="#333" />
                    <Text className='text-[#333] text-xl font-bold ml-2'>
                      Create Event
                    </Text>
                  </>
                )}
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}