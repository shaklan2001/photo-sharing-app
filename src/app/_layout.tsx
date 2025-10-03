import { Stack, Link } from "expo-router";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import "../../global.css";
import { AuthProvider } from "../providers/AuthProvider";
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
        name="index"
        options={{
          title: "Events",
          headerLargeTitle: true,
          headerTransparent: true,
        }}
      />

      <Stack.Screen
        name="events/[id]/index"
        options={{
          title: "Event",
          headerLargeTitle: true,
          headerTransparent: true,
          headerBackButtonDisplayMode: "minimal",
        }}
      />

      <Stack.Screen
        name="events/[id]/camera"
        options={{
          title: "Camera",
          headerBackButtonDisplayMode: "minimal",
          headerTransparent: true,
          headerBlurEffect: "dark",
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
        }}
      />

      <Stack.Screen
        name="events/[id]/join"
        options={{
          title: "Join event",
          presentation: "modal",
        }}
      />

      <Stack.Screen
        name="events/create"
        options={{
          title: "Create Event",
          presentation: "modal",
        }}
      />
    </Stack>
  );
};
