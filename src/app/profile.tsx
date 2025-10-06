import { memo, useEffect, useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '../providers/AuthProvider';
import Ionicons from '@expo/vector-icons/Ionicons';
import { getUserInfo } from '../services/user';
import { User } from '@supabase/supabase-js';

interface UserWithProfile extends User {
  profile?: {
    full_name?: string | null;
    avatar_url?: string | null;
    username?: string | null;
  };
}

export default function ProfileScreen() {
  const { user, loginType, signOut } = useAuth();
  const [userInfo, setUserInfo] = useState<UserWithProfile | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const info = await getUserInfo();
      setUserInfo(info);
    };
    fetchUserInfo();
  }, []);

  console.log('User Info:', userInfo);
  console.log('User:', user);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/signin');
          },
        },
      ]
    );
  };

  const getUserDisplayName = () => {
    // For Google users, use metadata or email
    if (loginType === 'google') {
      return user?.user_metadata?.full_name || 
             user?.user_metadata?.name || 
             user?.email?.split('@')[0] || 
             'Google User';
    }
    
    // For email users, use metadata or email
    if (loginType === 'email') {
      return user?.user_metadata?.full_name || 
             user?.email?.split('@')[0] || 
             'User';
    }
    
    // Fallback
    return userInfo?.profile?.full_name || 'User';
  };

  const getUserEmail = () => {
    return user?.email || 'No email available';
  };

  return (
    <SafeAreaView className='flex-1 bg-white'>
      {/* Header */}
      <View className='flex-row items-center justify-between px-4 py-3 border-b border-gray-100'>
        <Pressable 
          onPress={() => router.back()}
          className='p-2'
        >
          <Ionicons name='arrow-back' size={24} color='#333' />
        </Pressable>
        <Text className='text-lg font-bold text-gray-800'>Profile</Text>
        <View className='w-8' />
      </View>

      {/* Profile Content */}
      <View className='flex-1 px-4 py-6'>
        {/* Profile Avatar Section */}
        <View className='items-center mb-8'>
          <View className='w-24 h-24 rounded-full bg-gradient-to-br from-[#fdbf7b] to-[#fed194] items-center justify-center mb-4'>
            <Text className='text-3xl font-bold text-white'>
              {getUserDisplayName().charAt(0).toUpperCase()}
            </Text>
          </View>
          
          <Text className='text-2xl font-bold text-gray-800 mb-2'>
            {getUserDisplayName()}
          </Text>
          
          <Text className='text-gray-500 text-center'>
            {getUserEmail()}
          </Text>
        </View>

        {/* Profile Options */}
        <View className='space-y-4'>
          {/* Account Settings */}
          <Pressable className='bg-gray-50 p-4 rounded-2xl flex-row items-center'>
            <View className='w-10 h-10 rounded-full bg-gray-200 items-center justify-center mr-4'>
              <Ionicons name='person-outline' size={20} color='#666' />
            </View>
            <View className='flex-1'>
              <Text className='text-lg font-semibold text-gray-800'>Account Settings</Text>
              <Text className='text-sm text-gray-500'>Manage your account preferences</Text>
            </View>
            <Ionicons name='chevron-forward' size={20} color='#999' />
          </Pressable>

          {/* Privacy */}
          <Pressable className='bg-gray-50 p-4 rounded-2xl flex-row items-center'>
            <View className='w-10 h-10 rounded-full bg-gray-200 items-center justify-center mr-4'>
              <Ionicons name='shield-outline' size={20} color='#666' />
            </View>
            <View className='flex-1'>
              <Text className='text-lg font-semibold text-gray-800'>Privacy</Text>
              <Text className='text-sm text-gray-500'>Control your privacy settings</Text>
            </View>
            <Ionicons name='chevron-forward' size={20} color='#999' />
          </Pressable>

          {/* Help & Support */}
          <Pressable className='bg-gray-50 p-4 rounded-2xl flex-row items-center'>
            <View className='w-10 h-10 rounded-full bg-gray-200 items-center justify-center mr-4'>
              <Ionicons name='help-circle-outline' size={20} color='#666' />
            </View>
            <View className='flex-1'>
              <Text className='text-lg font-semibold text-gray-800'>Help & Support</Text>
              <Text className='text-sm text-gray-500'>Get help and contact support</Text>
            </View>
            <Ionicons name='chevron-forward' size={20} color='#999' />
          </Pressable>
        </View>

        {/* Logout Button */}
        <View className='mt-8'>
          <Pressable onPress={handleLogout}>
            <LinearGradient
              colors={['#ff6b6b', '#ff8e8e']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ 
                padding: 16, 
                borderRadius: 16, 
                flexDirection: 'row', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <Ionicons name='log-out-outline' size={24} color='white' />
              <Text className='text-white text-lg font-bold ml-2'>
                Logout
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
