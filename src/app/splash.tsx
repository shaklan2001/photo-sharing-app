import React, { useEffect } from "react";
import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/onboarding");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={["#fdbf7b", "#fed194"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="flex-1"
      >
        <View className="flex-1 justify-center items-center">
          <View className="mb-8">
            <Image
              source={require("../../assets/icon.png")}
              className="w-32 h-32"
              resizeMode="contain"
            />
          </View>
          
          <Text className="text-4xl font-bold text-black text-center">
            SnapHive
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
