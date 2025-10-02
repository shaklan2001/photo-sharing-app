import { Link } from 'expo-router'
import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { supabase } from '../lib/superbase'

export default function Entry () {

  useEffect(()=> {
   supabase.from('events').select('*, assets(*)').then(({data})=> {
    console.log(JSON.stringify(data, null, 2))
   })
  },[])

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


