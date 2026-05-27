import BottomNavigation from "@/src/components/BottomNavigation";
import TaskSummary from "@/src/components/TaskSummary";
import { useTasks } from "@/src/utils/useTasks";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const Stats = () => {
  const { tasks } = useTasks();
  const historyTasks = [...tasks].sort((firstTask, secondTask) =>
    secondTask.createdAt.localeCompare(firstTask.createdAt)
  );

  return (
    <View className="flex-1 bg-[#161622]">
      <ScrollView className="flex-1" contentContainerClassName="pt-14 pb-28">
        <View className="px-5">
          <Text className="text-white text-2xl font-bold">History</Text>
          <Text className="text-gray-400 mt-1">
            Old tasks and completion status
          </Text>
        </View>

        <TaskSummary />

        <View className="px-4 mt-6 gap-3">
          {historyTasks.length ? (
            historyTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                activeOpacity={0.85}
                onPress={() =>
                  router.push({
                    pathname: "/task/[id]",
                    params: { id: task.id },
                  })
                }
                className="bg-slate-600 rounded-xl p-4"
              >
                <View className="flex-row justify-between gap-3">
                  <View className="flex-1">
                    <Text
                      className={`text-white font-bold ${
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
            ))
          ) : (
            <Text className="text-gray-300 bg-slate-600 rounded-xl p-5">
              No task history yet
            </Text>
          )}
        </View>
      </ScrollView>
      <BottomNavigation />
    </View>
  );
};

export default Stats;
