import { Ionicons } from "@expo/vector-icons";
import { Href, router, usePathname } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TABS = [
  { name: "Home", path: "/home" as Href, icon: "home-outline" as const },
  {
    name: "Schedule",
    path: "/schedule" as Href,
    icon: "calendar-outline" as const,
  },
  { name: "Stats", path: "/stats" as Href, icon: "bar-chart-outline" as const },
  {
    name: "Settings",
    path: "/settings" as Href,
    icon: "settings-outline" as const,
  },
];

export default function BottomNavigation() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row bg-[#12122A] border-t border-[#2D2D4A]"
      style={[styles.container, { paddingBottom: insets.bottom + 8 }]}
    >
      {TABS.map((tab) => {
        const isActive = pathname === tab.path;
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => {
              if (!isActive) {
                router.navigate(tab.path);
              }
            }}
            activeOpacity={0.7}
            className="flex-1 items-center gap-1"
          >
            <View
              className={`w-10 h-10 rounded-full items-center justify-center ${
                isActive ? "bg-[#6C63FF]" : "bg-transparent"
              }`}
            >
              <Ionicons
                name={tab.icon}
                size={20}
                color={isActive ? "#FFFFFF" : "#8888AA"}
              />
            </View>
            <Text
              className={`text-[9px] font-medium ${
                isActive ? "text-[#6C63FF]" : "text-[#8888AA]"
              }`}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
});
