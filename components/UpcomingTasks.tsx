import React from "react";
import { Text, View } from "react-native";

const UpcomingTasks = () => {
  return (
    <View>
      <View>
       
      </View>
      <View className="flex-col px-4 mt-2 gap-3 pb-8">
        <View className=" ">
          <Text className="text-white p-7  bg-slate-600 rounded-xl ">
            Card 1
          </Text>
        </View>

        <View className="">
          <Text className="text-white p-7 bg-slate-600 rounded-xl ">
            Card 2
          </Text>
        </View>

        <View className="">
          <Text className="text-white p-7 bg-slate-600 rounded-xl ">
            Card 3
          </Text>
        </View>
        <View className="">
          <Text className="text-white p-7 bg-slate-600 rounded-xl ">
            Card 4
          </Text>
        </View>
      </View>
    </View>
  );
};

export default UpcomingTasks;
