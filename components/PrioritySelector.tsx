import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const PrioritySelector = () => {
  const [priority, setPriority] = useState("");
  
  return (
    <View className="flex-row gap-3 mt-4">
      <TouchableOpacity
        onPress={() => setPriority("Low")}
        className={`px-4 py-2 rounded-full
            ${priority === "Low" ? "bg-green-500" : "bg-green-500/20"}
      `}
      >
        <Text className="text-white font-medium">Low</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setPriority("Normal")}
        className={`px-4 py-2 rounded-full
            ${priority === "Normal" ? "bg-yellow-500" : "bg-yellow-500/20"}
      `}
      >
        <Text className="text-white font-medium">Normal</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setPriority("Urgent")}
        className={`px-4 py-2 rounded-full
            ${priority === "Urgent" ? "bg-red-500" : "bg-red-500/20"}
      `}
      >
        <Text className="text-white font-medium">Urgent</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PrioritySelector;
