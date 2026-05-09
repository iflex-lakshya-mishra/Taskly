import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, Text } from "react-native";

const FloatingButton = () => {
  const handleOpen = () => {
    router.push("/TaskCard");
  };
  return (
    <TouchableOpacity
      onPress={handleOpen}
      className="
      absolute
      bottom-40
      right-5
      w-16
      h-16
      rounded-full
      bg-purple-500
      justify-center
      items-center
      shadow-lg
      "
    >
      <Text className="text-white text-4xl mb-1">
        +
      </Text>
    </TouchableOpacity>
  );
};

export default FloatingButton;
