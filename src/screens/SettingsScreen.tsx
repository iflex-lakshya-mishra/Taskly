import BottomNavigation from "@/src/components/BottomNavigation";
import { auth } from "@/src/firebase/config";
import { useTasks } from "@/src/utils/useTasks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { signOut, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Settings = () => {
  const { clearTasks } = useTasks();
  const user = auth.currentUser;
  const [name, setName] = useState(user?.displayName || "");

  const handleSaveName = async () => {
    const displayName = name.trim();
    if (!displayName) {
      Alert.alert("Error", "Enter your name");
      return;
    }

    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName });
        await AsyncStorage.setItem("current-user-display-name", displayName);
        await AsyncStorage.setItem(
          `user-display-name-${auth.currentUser.uid}`,
          displayName
        );

        if (auth.currentUser.email) {
          await AsyncStorage.setItem(
            `user-display-name-${auth.currentUser.email.toLowerCase()}`,
            displayName
          );
        }
        Alert.alert("Saved", "Name updated");
      } catch {
        Alert.alert("Error", "Could not update your name. Please try again.");
      }
    }
  };

  const handleClearTasks = () => {
    Alert.alert("Clear tasks", "Delete all saved tasks?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: clearTasks,
      },
    ]);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch {
      Alert.alert("Error", "Could not sign out. Please try again.");
    }
  };

  return (
    <View className="flex-1 bg-[#161622]">
      <View className="flex-1 px-5 pt-14">
        <Text className="text-white text-2xl font-bold">Settings</Text>

        <View className="bg-[#1E293B] rounded-2xl p-5 mt-6">
          <Text className="text-gray-400">Account</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter name"
            placeholderTextColor="gray"
            className="text-white text-xl font-bold mt-2 border border-slate-600 rounded-xl px-4 h-12"
          />
          <Text className="text-gray-300 mt-3">
            {user?.email || "No email"}
          </Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSaveName}
            className="mt-4 h-12 rounded-xl bg-purple-500 items-center justify-center"
          >
            <Text className="text-white font-bold">Save Name</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-[#1E293B] rounded-2xl p-5 mt-4">
          <Text className="text-white text-lg font-bold">Basic Settings</Text>
          <Text className="text-gray-300 mt-3">Task data is saved locally.</Text>
          <Text className="text-gray-300 mt-1">
            Tap any task to mark it done or pending.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleClearTasks}
          className="mt-5 h-14 rounded-xl bg-red-500/20 border border-red-500 items-center justify-center"
        >
          <Text className="text-red-200 font-bold">Clear All Tasks</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSignOut}
          className="mt-3 h-14 rounded-xl bg-purple-500 items-center justify-center"
        >
          <Text className="text-white font-bold">Sign Out</Text>
        </TouchableOpacity>
      </View>
      <BottomNavigation />
    </View>
  );
};

export default Settings;
