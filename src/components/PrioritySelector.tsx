import { TaskPriority } from "@/src/utils/useTasks";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type PrioritySelectorProps = {
  priority: TaskPriority;
  onChangePriority: (priority: TaskPriority) => void;
};

const priorities: TaskPriority[] = ["Low", "Normal", "Urgent"];

const getPriorityClassName = (
  priority: TaskPriority,
  selectedPriority: TaskPriority
) => {
  if (priority === "Low") {
    return selectedPriority === "Low" ? "bg-green-500" : "bg-green-500/20";
  }

  if (priority === "Normal") {
    return selectedPriority === "Normal"
      ? "bg-yellow-500"
      : "bg-yellow-500/20";
  }

  return selectedPriority === "Urgent" ? "bg-red-500" : "bg-red-500/20";
};

const PrioritySelector = ({
  priority,
  onChangePriority,
}: PrioritySelectorProps) => {
  return (
    <View className="flex-row gap-3 mt-4">
      {priorities.map((item) => (
        <TouchableOpacity
          key={item}
          onPress={() => onChangePriority(item)}
          className={`px-4 py-2 rounded-full ${getPriorityClassName(
            item,
            priority
          )}`}
        >
          <Text className="text-white font-medium">{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default PrioritySelector;
