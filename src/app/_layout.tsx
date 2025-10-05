import { Stack, Link } from "expo-router";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Platform } from "react-native";
import "../../global.css";
import { AuthProvider } from "../providers/TokenAuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Ionicons from "@expo/vector-icons/Ionicons";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

const RootLayoutNav = () => {
  return (
    <Stack>
      <Stack.Screen
        name="splash"
        options={{
          headerShown: false,
        }}
      />
      
      <Stack.Screen
        name="onboarding"
        options={{
          headerShown: false,
        }}
      />
      
      <Stack.Screen
        name="events"
        options={{
          headerShown: false,
        }}
      />
      
      <Stack.Screen
        name="index"
        options={{
          title: "Events",
          headerLargeTitle: Platform.OS === 'ios',
          headerTransparent: Platform.OS === 'ios',
          headerStyle: Platform.OS === 'android' ? {
            backgroundColor: '#1a1a1a',
          } : undefined,
          headerTintColor: 'white',
        }}
      />

      <Stack.Screen
        name="events/[id]/index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="events/[id]/camera"
        options={{
          title: "Camera",
          headerBackButtonDisplayMode: "minimal",
          headerTransparent: Platform.OS === 'ios',
          headerBlurEffect: Platform.OS === 'ios' ? "dark" : undefined,
          headerStyle: Platform.OS === 'android' ? {
            backgroundColor: '#000000',
          } : undefined,
          headerTintColor: 'white',
          headerRight: () => (
            <Link href="/" className="mr-2 ml-2">
              <Ionicons name="share-outline" size={24} color="white" />
            </Link>
          ),
        }}
      />

      <Stack.Screen
        name="events/[id]/share"
        options={{
          title: "Share",
          presentation: "modal",
          headerStyle: Platform.OS === 'android' ? {
            backgroundColor: '#1a1a1a',
          } : undefined,
          headerTintColor: 'white',
        }}
      />

      <Stack.Screen
        name="events/[id]/join"
        options={{
          title: "Join event",
          presentation: "modal",
          headerStyle: Platform.OS === 'android' ? {
            backgroundColor: '#1a1a1a',
          } : undefined,
          headerTintColor: 'white',
        }}
      />

      <Stack.Screen
        name="events/create"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="profile"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};
