import CalendarModal from "@/components/CalendarModal";
import PrioritySelector from "@/components/PrioritySelector";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const TaskCardScreen = () => {
  const [title, setTitle] = useState("");

  const [note, setNote] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index);
      return date;
    });
  }, []);

  const formatTaskDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const handleCreateTask = () => {
    const newTask = {
      title: title,
      note: note,
      date: formatTaskDate(selectedDate),
    };
  };

  return (
    <View className="flex-1 bg-[#161622]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-14 pb-8"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-6">
          <Text className="font-bold text-2xl text-white">My Tasks</Text>
        </View>
        <Text className="font-medium text-white text-xl mb-2">Title</Text>
        <View className="flex-row items-center bg-[#1E293B] rounded px-4 h-12">
          <TextInput
            onChangeText={setTitle}
            value={title}
            className="flex-1 text-white"
            placeholder="What need to be done?"
            placeholderTextColor="gray"
          />
        </View>
        <Text className="font-medium text-white text-xl mb-2 mt-4">NOTE</Text>
        <View className="flex-row bg-[#1E293B] rounded px-4 py-3 h-32">
          <TextInput
            onChangeText={setNote}
            value={note}
            className="flex-1 text-white"
            placeholder="Add a Note or details...."
            placeholderTextColor="gray"
            textAlignVertical="top"
            multiline={true}
          />
        </View>
        <View className="mt-4">
          <View className="flex-row items-center mb-3">
            <Ionicons name="calendar-outline" size={22} color="#FFFFFF" />
            <Text className="font-medium text-white text-xl ml-2">Date</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-3">
              {calendarDays.map((date) => {
                const isSelected =
                  formatTaskDate(date) === formatTaskDate(selectedDate);
                return (
                  <TouchableOpacity
                    key={formatTaskDate(date)}
                    activeOpacity={0.85}
                    onPress={() => setSelectedDate(date)}
                    className={`w-16 h-20 rounded-xl items-center justify-center ${
                      isSelected ? "bg-purple-500" : "bg-[#1E293B]"
                    }`}
                  >
                    <Text className="text-gray-300 text-xs">
                      {date.toLocaleDateString("en-US", { weekday: "short" })}
                    </Text>
                    <Text className="text-white text-xl font-bold mt-1">
                      {date.getDate()}
                    </Text>
                    <Text className="text-gray-300 text-xs mt-1">
                      {date.toLocaleDateString("en-US", { month: "short" })}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => setIsCalendarOpen(true)}
                className="w-16 h-20 rounded-xl items-center justify-center border border-purple-500 bg-purple-500/10"
              >
                <Ionicons name="calendar-outline" size={22} color="#A855F7" />
                <Text className="text-purple-300 text-xs font-bold mt-2">
                  Calendar
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
        <PrioritySelector />
        <TouchableOpacity
          disabled={!title.trim()}
          activeOpacity={0.85}
          onPress={handleCreateTask}
          className={`mt-6 h-14 rounded-xl items-center justify-center ${
            title.trim() ? "bg-purple-500" : "bg-purple-500/40"
          }`}
        >
          <Text className="text-white text-lg font-bold">Create Task</Text>
        </TouchableOpacity>
      </ScrollView>
      <CalendarModal
        visible={isCalendarOpen}
        selectedDate={selectedDate}
        onClose={() => setIsCalendarOpen(false)}
        onSelectDate={setSelectedDate}
      />
    </View>
  );
};

export default TaskCardScreen;
