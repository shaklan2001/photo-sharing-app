import { Stack, Link } from "expo-router";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import Feather from "@expo/vector-icons/Feather";
import "../../global.css";
import { AuthProvider } from "../providers/AuthProvider";

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ThemeProvider>
  );
}

const RootLayoutNav = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Events", headerLargeTitle: true }}
      />
      <Stack.Screen
        name="camera"
        options={{
          title: "Camera",
          headerBackButtonDisplayMode: "minimal",
          headerTransparent: true,
          headerBlurEffect: "systemChromeMaterial",
          headerRight: () => (
            <Link href="/camera" className="ml-2">
              <Feather name="share" size={22} color="white" />
            </Link>
          ),
        }}
      />
    </Stack>
  );
};
