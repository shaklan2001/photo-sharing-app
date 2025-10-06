import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../providers/AuthProvider";
import { Stack } from "expo-router";

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signInWithEmail, signInWithGoogle } = useAuth();

  const handleEmailSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Information', 'Please enter your email and password');
      return;
    }

    try {
      setIsLoading(true);
      
      const { error } = await signInWithEmail(email.trim(), password);
      
      if (error) {
        Alert.alert('Sign In Error', error.message || 'Failed to sign in');
        return;
      }

      router.replace('/events');
    } catch (error) {
      Alert.alert('Sign In Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      
      const { error, success } = await signInWithGoogle();
      
      if (error) {
        Alert.alert('Sign In Error', error?.message || 'Failed to sign in with Google');
        return;
      }

      if (success) {
        console.log('Redirecting to events after Google sign-in');
        router.replace('/events');
      }
    } catch (error) {
      Alert.alert('Sign In Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-3">
            <Pressable 
              onPress={() => router.back()}
              className="p-2"
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </Pressable>
            <Text className="text-lg font-bold text-gray-800">Sign In</Text>
            <View className="w-8" />
          </View>

          <View className="flex-1 px-6 pt-8">
            {/* Welcome Section */}
            <View className="mb-8">
              <Text className="text-3xl font-bold text-gray-800 mb-2">
                Welcome Back
              </Text>
              <Text className="text-gray-500 text-base">
                Sign in to your account to continue sharing memories.
              </Text>
            </View>

            {/* Form Fields */}
            <View className="space-y-6 mb-8">
              {/* Email Input */}
              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </Text>
                <View className="bg-gray-50 rounded-2xl border border-gray-200 flex-row items-center px-4">
                  <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    className="flex-1 p-4 text-gray-800 text-base"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Password
                </Text>
                <View className="bg-gray-50 rounded-2xl border border-gray-200 flex-row items-center px-4">
                  <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    className="flex-1 p-4 text-gray-800 text-base"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons 
                      name={showPassword ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color="#9CA3AF" 
                    />
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Sign In Button */}
            <Pressable
              onPress={handleEmailSignIn}
              disabled={isLoading}
              className={`mb-4 ${isLoading ? 'opacity-50' : ''}`}
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
                {isLoading ? (
                  <>
                    <Ionicons name="hourglass-outline" size={24} color="#333" />
                    <Text className="text-[#333] text-lg font-bold ml-2">
                      Signing In...
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="log-in-outline" size={24} color="#333" />
                    <Text className="text-[#333] text-lg font-bold ml-2">
                      Sign In
                    </Text>
                  </>
                )}
              </LinearGradient>
            </Pressable>

            {/* Divider */}
            <View className="flex-row items-center mb-4">
              <View className="flex-1 h-px bg-gray-200" />
              <Text className="mx-4 text-gray-500 text-sm">or</Text>
              <View className="flex-1 h-px bg-gray-200" />
            </View>

            {/* Google Sign In Button */}
            <Pressable
              onPress={handleGoogleSignIn}
              disabled={isLoading}
              className={`mb-6 bg-white border border-gray-200 rounded-2xl p-4 flex-row items-center justify-center ${
                isLoading ? 'opacity-50' : ''
              }`}
            >
              <Ionicons name="logo-google" size={20} color="#4285F4" />
              <Text className="text-gray-700 text-lg font-semibold ml-2">
                Continue with Google
              </Text>
            </Pressable>

            {/* Sign Up Link */}
            <View className="flex-row justify-center items-center">
              <Text className="text-gray-500 text-base">
                Don't have an account?{' '}
              </Text>
              <Pressable onPress={() => router.replace('/signup')}>
                <Text className="text-[#fdbf7b] font-semibold text-base">
                  Sign Up
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </>
  );
}
