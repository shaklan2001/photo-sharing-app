import { useState } from "react";
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../providers/AuthProvider";
import { Stack } from "expo-router";

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signUpWithEmail, signInWithGoogle } = useAuth();

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim() || !fullName.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters long');
      return;
    }

    try {
      setIsLoading(true);
      
      const { error } = await signUpWithEmail(email.trim(), password, fullName.trim());
      
      if (error) {
        Alert.alert('Sign Up Error', error.message || 'Failed to create account');
        return;
      }

      Alert.alert(
        'Account Created!', 
        'Please check your email to verify your account before signing in.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/signin')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Sign Up Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      
      const { error, success } = await signInWithGoogle();
      
      if (error) {
        Alert.alert('Sign Up Error', error?.message || 'Failed to sign up with Google');
        return;
      }

      if (success) {
        console.log('Redirecting to events after Google sign-up');
        router.replace('/events');
      }
    } catch (error) {
      Alert.alert('Sign Up Error', 'Something went wrong. Please try again.');
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
            <Text className="text-lg font-bold text-gray-800">Create Account</Text>
            <View className="w-8" />
          </View>

          <View className="flex-1 px-6 pt-8">
            {/* Welcome Section */}
            <View className="mb-8">
              <Text className="text-3xl font-bold text-gray-800 mb-2">
                Join SnapHive
              </Text>
              <Text className="text-gray-500 text-base">
                Create your account to start sharing memories with friends and family.
              </Text>
            </View>

            {/* Form Fields */}
            <View className="space-y-6 mb-8">
              {/* Full Name Input */}
              <View>
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </Text>
                <View className="bg-gray-50 rounded-2xl border border-gray-200 flex-row items-center px-4">
                  <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                  <TextInput
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Enter your full name"
                    className="flex-1 p-4 text-gray-800 text-base"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="words"
                    autoComplete="name"
                  />
                </View>
              </View>

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
                    placeholder="Create a password"
                    className="flex-1 p-4 text-gray-800 text-base"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                    autoComplete="password-new"
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons 
                      name={showPassword ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color="#9CA3AF" 
                    />
                  </Pressable>
                </View>
                <Text className="text-xs text-gray-500 mt-1 ml-1">
                  Must be at least 6 characters long
                </Text>
              </View>
            </View>

            {/* Sign Up Button */}
            <Pressable
              onPress={handleSignUp}
              disabled={isLoading}
              className={`mb-6 ${isLoading ? 'opacity-50' : ''}`}
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
                      Creating Account...
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="person-add-outline" size={24} color="#333" />
                    <Text className="text-[#333] text-lg font-bold ml-2">
                      Create Account
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

            {/* Google Sign Up Button */}
            <Pressable
              onPress={handleGoogleSignUp}
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

            {/* Sign In Link */}
            <View className="flex-row justify-center items-center">
              <Text className="text-gray-500 text-base">
                Already have an account?{' '}
              </Text>
              <Pressable onPress={() => router.replace('/signin')}>
                <Text className="text-[#fdbf7b] font-semibold text-base">
                  Sign In
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
