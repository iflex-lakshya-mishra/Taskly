import BottomNavigation from "@/src/components/BottomNavigation";
import PrioritySelector from "@/src/components/PrioritySelector";
import { TaskPriority, useTasks } from "@/src/utils/useTasks";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const formatTaskDate = (date: Date) => date.toISOString().split("T")[0];

const Schedule = () => {
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Normal");
  const { tasks, addTask, toggleTaskComplete } = useTasks();

  const selectedDateKey = formatTaskDate(selectedDate);

  const monthDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const emptyDays = Array.from({ length: firstDay }, () => null);
    const dates = Array.from(
      { length: daysInMonth },
      (_, index) => new Date(year, month, index + 1)
    );

    return [...emptyDays, ...dates];
  }, [calendarMonth]);

  const selectedDateTasks = useMemo(() => {
    return tasks
      .filter((task) => task.date === selectedDateKey)
      .sort((firstTask, secondTask) =>
        firstTask.createdAt.localeCompare(secondTask.createdAt)
      );
  }, [selectedDateKey, tasks]);

  const getTasksForDate = (date: Date) => {
    const dateKey = formatTaskDate(date);
    return tasks.filter((task) => task.date === dateKey);
  };

  const changeMonth = (step: number) => {
    setCalendarMonth((currentMonth) => {
      const nextMonth = new Date(currentMonth);
      nextMonth.setMonth(nextMonth.getMonth() + step);
      return nextMonth;
    });
  };

  const handleAddEvent = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Enter event title");
      return;
    }

    try {
      await addTask({
        title: title.trim(),
        note: note.trim(),
        date: selectedDateKey,
        priority,
      });

      setTitle("");
      setNote("");
      setPriority("Normal");
      Alert.alert("Saved", "Event added to schedule");
    } catch {
      Alert.alert("Error", "Could not save event. Please try again.");
    }
  };

  return (
    <View className="flex-1 bg-[#161622]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-14 pb-8"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-white text-2xl font-bold">Schedule</Text>

        <View className="bg-[#1E293B] rounded-2xl p-4 mt-5">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity
              onPress={() => changeMonth(-1)}
              className="w-10 h-10 rounded-full bg-[#0F172A] items-center justify-center"
            >
              <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <Text className="text-white text-lg font-bold">
              {calendarMonth.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </Text>
            <TouchableOpacity
              onPress={() => changeMonth(1)}
              className="w-10 h-10 rounded-full bg-[#0F172A] items-center justify-center"
            >
              <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View className="flex-row mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <Text
                key={day}
                className="flex-1 text-center text-gray-400 text-xs font-bold"
              >
                {day}
              </Text>
            ))}
          </View>

          <View className="flex-row flex-wrap">
            {monthDays.map((date, index) => {
              const isSelected =
                date && formatTaskDate(date) === selectedDateKey;
              const dateTasks = date ? getTasksForDate(date) : [];

              return (
                <View
                  key={`${date?.toString() ?? "empty"}-${index}`}
                  className="w-[14.28%] p-1"
                >
                  {date ? (
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => setSelectedDate(date)}
                      className={`h-14 rounded-xl items-center justify-center ${
                        isSelected ? "bg-purple-500" : "bg-[#0F172A]"
                      }`}
                    >
                      <Text className="text-white font-bold">
                        {date.getDate()}
                      </Text>
                      {!!dateTasks.length && (
                        <Text className="text-[10px] text-purple-200 mt-1">
                          {dateTasks.length} event
                        </Text>
                      )}
                    </TouchableOpacity>
                  ) : (
                    <View className="h-14" />
                  )}
                </View>
              );
            })}
          </View>
        </View>

        <Text className="text-white text-lg font-bold mt-6">
          Add event for{" "}
          {selectedDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Event title"
          placeholderTextColor="gray"
          className="mt-3 bg-[#1E293B] rounded-xl px-4 h-12 text-white"
        />
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Event note"
          placeholderTextColor="gray"
          multiline
          textAlignVertical="top"
          className="mt-3 bg-[#1E293B] rounded-xl px-4 py-3 h-24 text-white"
        />
        <PrioritySelector
          priority={priority}
          onChangePriority={setPriority}
        />
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleAddEvent}
          className="mt-5 h-14 rounded-xl bg-purple-500 items-center justify-center"
        >
          <Text className="text-white text-lg font-bold">Save Event</Text>
        </TouchableOpacity>

        <Text className="text-white text-lg font-bold mt-8">
          Events on this date
        </Text>
        <View className="mt-3 gap-3">
          {selectedDateTasks.length ? (
            selectedDateTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                activeOpacity={0.85}
                onPress={() => toggleTaskComplete(task.id)}
                className="bg-slate-600 rounded-xl p-4"
              >
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
                  {task.priority} - {task.completed ? "Done" : "Pending"}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text className="text-gray-300 bg-slate-600 rounded-xl p-5">
              No events for this date
            </Text>
          )}
        </View>
      </ScrollView>

      <BottomNavigation />
    </View>
  );
};

export default Schedule;
