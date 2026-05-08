import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";
import NavigationBar from "@/components/NavigationBar";

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
    <View className="flex-1 bg-white">
      <LinearGradient
        colors={["#2563eb", "#06b6d4"]}
        className="h-40 rounded-b-3xl pt-12 pb-6 px-5"
      >
        <Text className="text-xl mb-2 text-white">{greeting} </Text>
        <Text className="text-3xl  font-bold text-white">{Name}</Text>
      </LinearGradient>

      <View className="flex-1 pb-28">
        <View className="p-9">
          <Text className="text-3xl font-bold">Today</Text>
        </View>
      </View>

      <NavigationBar />
    </View>
  );
};

export default Home;
