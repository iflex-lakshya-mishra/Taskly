import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TABS = [
  { name: "Home", icon: "home-outline" as const },
  { name: "Schedule", icon: "calendar-outline" as const },
  { name: "Stats", icon: "bar-chart-outline" as const },
  { name: "Settings", icon: "settings-outline" as const },
];

export default function NavigationBar() {
  const [active, setActive] = useState(0);
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row bg-[#12122A] border-t border-[#2D2D4A] pt-2"
      style={{ paddingBottom: insets.bottom + 8 }}
    >
      {TABS.map((tab, i) => {
        const isActive = active === i;
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => setActive(i)}
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
