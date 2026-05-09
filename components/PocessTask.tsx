import React from "react";
import { Text, View } from "react-native";

const PocessTask = () => {

  // Example Task Data
  const tasks = [
    { id: 1, completed: true },
    { id: 2, completed: true },
    { id: 3, completed: false },
    { id: 4, completed: false },
    { id: 5, completed: true },
  ];

  // Logic
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = totalTasks - completedTasks;

  // Progress %
  const progress = (completedTasks / totalTasks) * 100;

  return (
    <View className="mt-5 px-4">

      {/* Top 3 Cards */}
      <View className="flex-row justify-between">

        {/* Total */}
        <View className="bg-[#1E293B] w-[31%] p-4 rounded-3xl">
          <Text className="text-gray-400 text-sm">
            Tasks
          </Text>

          <Text className="text-white text-3xl font-bold mt-3">
            {totalTasks}
          </Text>
        </View>

        {/* Completed */}
        <View className="bg-[#2563EB] w-[31%] p-4 rounded-3xl">
          <Text className="text-blue-100 text-sm">
            Completed
          </Text>

          <Text className="text-white text-3xl font-bold mt-3">
            {completedTasks}
          </Text>
        </View>

        {/* Pending */}
        <View className="bg-[#10B981] w-[31%] p-4 rounded-3xl">
          <Text className="text-green-100 text-sm">
            Pending
          </Text>

          <Text className="text-white text-3xl font-bold mt-3">
            {pendingTasks}
          </Text>
        </View>

      </View>

      {/* Progress Section */}
      <View className="bg-[#1E293B] mt-6 p-5 rounded-3xl">

        <View className="flex-row justify-between items-center">
          <Text className="text-white text-lg font-bold">
            Today’s Progress
          </Text>

          <Text className="text-blue-400 font-bold">
            {Math.floor(progress)}%
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="w-full h-4 bg-gray-700 rounded-full overflow-hidden mt-4">

          <View
            className="h-4 bg-blue-500 rounded-full"
            style={{
              width: `${progress}%`,
            }}
          />
        </View>

        <Text className="text-gray-400 mt-3">
          {completedTasks} of {totalTasks} tasks completed
        </Text>

      </View>
    </View>
  );
};

export default PocessTask;