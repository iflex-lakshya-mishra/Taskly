import "react-native-gesture-handler";
import { Stack } from "expo-router";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export default function Layout() {
  const stableAnimation = Platform.OS === "android" ? "none" : "fade";
  const modalAnimation =
    Platform.OS === "android" ? "none" : "slide_from_bottom";

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: stableAnimation,
          gestureEnabled: Platform.OS !== "android",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="home" />
        <Stack.Screen name="schedule" />
        <Stack.Screen name="stats" />
        <Stack.Screen name="settings" />
        <Stack.Screen
          name="create-task"
          options={{ animation: modalAnimation }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
