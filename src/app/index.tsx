import { Link } from 'expo-router'
import React from 'react'
import { Text, ActivityIndicator, FlatList, Pressable } from 'react-native'
import { useAuth } from '../providers/AuthProvider'
import { useQuery } from '@tanstack/react-query'
import { getEvents } from '../services/events'
import Ionicons from '@expo/vector-icons/Ionicons'
import EventListItem from '../components/EventListItem'

export default function Entry () {
  const { user, isAuthenticated } = useAuth()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  })

  if (isLoading) {
    return <ActivityIndicator />
  }

  if (isError) {
    return <Text>Error: {isError.message}</Text>
  }

  return (
    <FlatList
      data={data}
      contentContainerClassName='gap-4 p-4'
      renderItem={({ item }) => <EventListItem event={item} />}
      contentInsetAdjustmentBehavior='automatic'
      ListHeaderComponent={() => (
        <Link href='/events/create' asChild>
          <Pressable className='bg-purple-800 p-4 rounded-lg items-center justify-center flex-row gap-2'>
            <Ionicons name='add-outline' size={24} color='white' />
            <Text className='text-white text-lg font-semibold'>
              Create Event
            </Text>
          </Pressable>
        </Link>
      )}
    />
  )
}


