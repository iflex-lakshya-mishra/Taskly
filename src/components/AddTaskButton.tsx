import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AddTaskButton = () => {
  const insets = useSafeAreaInsets();

  const handleOpen = () => {
    router.push("/create-task");
  };

  return (
    <TouchableOpacity
      onPress={handleOpen}
      activeOpacity={0.82}
      style={[styles.button, { bottom: 84 + insets.bottom }]}
    >
      <Text style={styles.plus}>+</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#A855F7",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
  },
  plus: {
    color: "#FFFFFF",
    fontSize: 36,
    lineHeight: 40,
    fontWeight: "500",
    includeFontPadding: false,
  },
});

export default AddTaskButton;
