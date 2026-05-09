import FloatingButton from "@/components/FloatingButton";
import NavigationBar from "@/components/NavigationBar";
import PocessTask from "@/components/PocessTask";
import UpcomingTasks from "@/components/UpcomingTasks";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, Text, View } from "react-native";

const Home = () => {
  const Name = "Lakshya";

  const date = new Date();
  const hour = date.getHours();

  let greeting = "";
  if (hour < 12) {
    greeting = "Good Morning ☀️ ";
  } else if (hour < 17) {
    greeting = "Good Afternoon 🌤️";
  } else if (hour < 21) {
    greeting = "Good Evening 🌆";
  } else {
    greeting = "Good Night🌙";
  }

  return (
    <View className="flex-1 bg-[#161622]">
      <LinearGradient
        colors={["#2563eb", "#06b6d4"]}
        className="h-40 rounded-b-3xl pt-12 pb-6 px-5"
      >
        <Text className="text-xl mb-2 text-white">{greeting} </Text>
        <Text className="text-3xl  font-bold text-white">{Name}</Text>
      </LinearGradient>

      <View>
        <PocessTask />
      </View>
      <Text className="text-white text-lg font-bold mt-4 mb-2 ml-5">
        Upcoming Tasks
      </Text>
      <ScrollView className="flex-1 bg-[#0F172A]">
        <View className="pb-4">
          <UpcomingTasks />
        </View>
      </ScrollView>

      <FloatingButton />
      <NavigationBar />
    </View>
  );
};

export default Home;
