import { Link } from 'expo-router'
import React from 'react'
import { View, Text } from 'react-native'

export default function Entry () {
  return (
    <View className="flex-1 justify-center items-center bg-gray-900">
      <Link href="/camera">
        <Text className="text-white text-xl">Go to Camera</Text>
      </Link>
    </View>
  )
}


