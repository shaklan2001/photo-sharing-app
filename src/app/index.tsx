import { Link } from 'expo-router'
import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { useAuth } from '../providers/AuthProvider'

export default function Entry () {
  const { user, isAuthenticated } = useAuth()
  console.log(user, isAuthenticated)
  
  return (
    <View className="flex-1 justify-center items-center bg-gray-900">
      <Link href="/camera">
        <Text className="text-white text-xl">Go to Camera</Text>
      </Link>
      <Link href="/events">
        <Text className="text-white text-xl">Go to Events</Text>
      </Link>
    </View>
  )
}


