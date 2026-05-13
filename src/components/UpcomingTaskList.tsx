import { useTasks } from "@/src/utils/useTasks";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const UpcomingTaskList = () => {
  const { isLoading, tasks, toggleTaskComplete } = useTasks();
  const upcomingTasks = tasks
    .filter((task) => !task.completed)
    .sort((firstTask, secondTask) =>
      firstTask.date.localeCompare(secondTask.date)
    );

  if (isLoading) {
    return (
      <View className="px-4 mt-2 pb-8">
        <Text className="text-gray-300 p-6 bg-slate-600 rounded-xl">
          Loading tasks...
        </Text>
      </View>
    );
  }

  if (!upcomingTasks.length) {
    return (
      <View className="px-4 mt-2 pb-8">
        <Text className="text-gray-300 p-6 bg-slate-600 rounded-xl">
          No upcoming tasks
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-col px-4 mt-2 gap-3 pb-8">
      {upcomingTasks.map((task) => (
        <TouchableOpacity
          key={task.id}
          activeOpacity={0.85}
          onPress={() => toggleTaskComplete(task.id)}
          className="bg-slate-600 rounded-xl p-4"
        >
          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-1">
              <Text
                className={`text-white text-base font-bold ${
                  task.completed ? "line-through text-gray-300" : ""
                }`}
              >
                {task.title}
              </Text>
              {!!task.note && (
                <Text className="text-gray-300 mt-1">{task.note}</Text>
              )}
              <Text className="text-gray-300 mt-2">
                {task.date} - {task.priority}
              </Text>
            </View>
            <Text className="text-white text-sm font-bold">
              {task.completed ? "Done" : "Pending"}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default UpcomingTaskList;
