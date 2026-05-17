import { useTasks } from "@/src/utils/useTasks";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const TaskSummary = () => {
  const {
    isLoading,
    stats: { totalTasks, completedTasks, pendingTasks, progress },
  } = useTasks();
  const progressPercent = Math.floor(progress);

  return (
    <View className="mt-5 px-4">
      <View className="flex-row justify-between">
        <View className="bg-[#1E293B] w-[31%] p-4 rounded-3xl">
          <Text className="text-gray-400 text-sm">Tasks</Text>
          <Text className="text-white text-3xl font-bold mt-3">
            {totalTasks}
          </Text>
        </View>

        <View className="bg-[#2563EB] w-[31%] p-4 rounded-3xl">
          <Text className="text-blue-100 text-sm">Completed</Text>
          <Text className="text-white text-3xl font-bold mt-3">
            {completedTasks}
          </Text>
        </View>

        <View className="bg-[#10B981] w-[31%] p-4 rounded-3xl">
          <Text className="text-green-100 text-sm">Pending</Text>
          <Text className="text-white text-3xl font-bold mt-3">
            {pendingTasks}
          </Text>
        </View>
      </View>

      <View className="bg-[#1E293B] mt-6 p-5 rounded-3xl">
        <View className="flex-row justify-between items-center">
          <Text className="text-white text-lg font-bold">
            {"Today's Progress"}
          </Text>
          <Text className="text-blue-400 font-bold">{progressPercent}%</Text>
        </View>

        <View className="w-full h-4 bg-gray-700 rounded-full overflow-hidden mt-4">
          <View
            className="h-4 bg-blue-500 rounded-full"
            style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
          />
        </View>

        <Text className="text-gray-400 mt-3">
          {isLoading
            ? "Loading tasks..."
            : `${completedTasks} of ${totalTasks} tasks completed`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarFill: {
    height: 16,
  },
});

export default TaskSummary;
