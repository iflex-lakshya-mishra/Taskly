import AddTaskButton from "@/src/components/AddTaskButton";
import BottomNavigation from "@/src/components/BottomNavigation";
import TaskSummary from "@/src/components/TaskSummary";
import UpcomingTaskList from "@/src/components/UpcomingTaskList";
import { auth } from "@/src/firebase/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good Morning";
  }

  if (hour < 17) {
    return "Good Afternoon";
  }

  if (hour < 21) {
    return "Good Evening";
  }

  return "Good Night";
};

const HomeScreen = () => {
  const params = useLocalSearchParams<{ name?: string }>();
  const routeName = Array.isArray(params.name) ? params.name[0] : params.name;
  const [displayName, setDisplayName] = useState(routeName || "");
  const [isNameLoading, setIsNameLoading] = useState(!routeName);

  useEffect(() => {
    if (routeName) {
      setDisplayName(routeName);
      AsyncStorage.setItem("current-user-display-name", routeName);
    }
  }, [routeName]);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          if (isMounted) {
            setDisplayName("");
          }
          return;
        }

        const currentName = await AsyncStorage.getItem(
          "current-user-display-name",
        );
        const storedName = await AsyncStorage.getItem(
          `user-display-name-${user.uid}`,
        );
        const emailName = user.email
          ? await AsyncStorage.getItem(
              `user-display-name-${user.email.toLowerCase()}`,
            )
          : "";
        const nextName =
          routeName ||
          currentName ||
          storedName ||
          emailName ||
          user.displayName ||
          "";

        if (isMounted) {
          setDisplayName(nextName);
        }
      } finally {
        if (isMounted) {
          setIsNameLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [routeName]);

  return (
    <View className="flex-1 bg-[#161622]">
      <LinearGradient
        colors={["#2563eb", "#06b6d4"]}
        className="h-40 rounded-b-3xl pt-12 pb-6 px-5"
      >
        <Text className="text-xl mb-2 text-white">{getGreeting()}</Text>
        <Text className="text-3xl font-bold text-white">
          {isNameLoading ? "Loading..." : displayName || "Taskly"}
        </Text>
      </LinearGradient>

      <TaskSummary />
      <Text className="text-white text-lg font-bold mt-4 mb-2 ml-5">
        Upcoming Tasks
      </Text>
      <ScrollView className="flex-1 bg-[#0F172A]">
        <View className="pb-4">
          <UpcomingTaskList />
        </View>
      </ScrollView>

      <AddTaskButton />
      <BottomNavigation />
    </View>
  );
};

export default HomeScreen;
