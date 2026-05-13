import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export default function Layout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="home" />
        <Stack.Screen name="schedule" />
        <Stack.Screen name="stats" />
        <Stack.Screen name="settings" />
        <Stack.Screen
          name="create-task"
          options={{ animation: "slide_from_bottom" }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
