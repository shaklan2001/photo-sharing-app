import React, { useState, useRef, useEffect } from "react";
import { View, Text, Pressable, Animated, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../providers/AuthProvider";

const onboardingData = [
  {
    id: 1,
    title: "Capture & Share Memories",
    description:
      "Create beautiful photo collections with friends and family. Every moment becomes a shared treasure.",
    image: require("../../assets/images/onboarding_screen_1.png"),
    gradient: ["#fdbf7b", "#fed194"] as const,
  },
  {
    id: 2,
    title: "Join Events with\nQR Code",
    description:
      "Simply scan a QR code to instantly connect to any event and start sharing photos with everyone.",
    image: require("../../assets/images/onboarding_screen_2.png"),
    gradient: ["#fdbf7b", "#fed194"] as const,
  },
  {
    id: 3,
    title: "Create Your Photo Hive",
    description:
      "Start your own events, invite friends, and build amazing photo collections together. The memories are yours to keep.",
    image: require("../../assets/images/onboarding_screen_3.png"),
    gradient: ["#fdbf7b", "#fed194"] as const,
  },
];

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const { signInWithGoogle } = useAuth();

  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(50);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentIndex]);

  const nextScreen = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Navigate to main app
      router.replace("/events");
    }
  };

  const prevScreen = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentData = onboardingData[currentIndex];
  const isLastScreen = currentIndex === onboardingData.length - 1;

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      const { data, error } = await signInWithGoogle();
      
      if (error) {
        Alert.alert('Sign In Error', error.message || 'Failed to sign in with Google');
        return;
      }

      if (data?.user) {
        router.replace("/events");
      }
    } catch (error) {
      Alert.alert('Sign In Error', 'Something went wrong. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={["#fdbf7b", "#fed194"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1"
      >
        <View
          className="flex-1 justify-between px-5"
          style={{ marginTop: 120 }}
        >
          <Animated.View
            className="justify-center items-center gap-2.5"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <View className="w-[90%] h-[430px] flex-row justify-center items-center">
              <Image
                source={currentData.image}
                className="w-[100%] h-[100%] rounded-xl"
                resizeMode="contain"
              />
            </View>
            <View className="w-4/5 mt-5">
              <Text className="text-[32px] font-bold text-center">
                {currentData.title}
              </Text>
            </View>
            <View className="w-[90%]">
              <Text className="text-base mt-2.5 text-center">
                {currentData.description}
              </Text>
            </View>
          </Animated.View>

          <Animated.View
            className="flex-row justify-center my-7.5"
            style={{ opacity: fadeAnim }}
          >
            {onboardingData.map((_, index) => (
              <View
                key={index}
                className={`w-2.5 h-2.5 rounded-xl mx-1.5 ${
                  index === currentIndex ? "bg-[#ffb600]" : "bg-[#fffefe]"
                }`}
              />
            ))}
          </Animated.View>

          <Animated.View
            className="flex-row justify-between mb-10"
            style={{ opacity: fadeAnim }}
          >
            {!isLastScreen ? (
              <Pressable
                onPress={nextScreen}
                className="flex-1 bg-[#ffb600] rounded-[30px] py-4 flex-row items-center justify-center"
              >
                <Text className="text-[#333] text-lg font-bold mr-1.5">
                  Next
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={22}
                  color="#333"
                  style={{ marginTop: 1 }}
                />
              </Pressable>
            ) : (
              <View className="flex-1 gap-3">
                {/* Google Sign-In Button */}
                <Pressable
                  onPress={handleGoogleSignIn}
                  disabled={isSigningIn}
                  className={`bg-white rounded-[30px] py-4 flex-row items-center justify-center ${
                    isSigningIn ? 'opacity-50' : ''
                  }`}
                >
                  <Ionicons
                    name="logo-google"
                    size={20}
                    color="#4285F4"
                    style={{ marginRight: 8 }}
                  />
                  <Text className="text-gray-700 text-lg font-bold">
                    {isSigningIn ? 'Signing in...' : 'Continue with Google'}
                  </Text>
                </Pressable>

                {/* Alternative Sign Up Button */}
                <Pressable
                  onPress={() => router.replace("/events")}
                  className="bg-[#ffb600] rounded-[30px] py-4 flex-row items-center justify-center"
                >
                  <Text className="text-[#333] text-lg font-bold mr-1.5">
                    Continue as Guest
                  </Text>
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color="#333"
                    style={{ marginTop: 2 }}
                  />
                </Pressable>
              </View>
            )}
          </Animated.View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
