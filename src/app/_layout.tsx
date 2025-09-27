import { Stack } from "expo-router";
import {DarkTheme, ThemeProvider} from "@react-navigation/native";
import "../../global.css";

export default function RootLayout() {
  return (
    <ThemeProvider value={DarkTheme}>
      <RootLayoutNav />
    </ThemeProvider>
  );
}

const RootLayoutNav = () => {
  return (
    <Stack>
        <Stack.Screen 
          name="index" 
          options={{title: 'Events', headerLargeTitle: true}} />
    </Stack>
  )
};