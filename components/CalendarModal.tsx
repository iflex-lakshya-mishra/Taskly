import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

type CalendarModalProps = {
  visible: boolean;
  selectedDate: Date;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
};

const formatTaskDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

const CalendarModal = ({
  visible,
  selectedDate,
  onClose,
  onSelectDate,
}: CalendarModalProps) => {
  const [calendarMonth, setCalendarMonth] = useState(new Date());

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

  const changeMonth = (step: number) => {
    setCalendarMonth((currentMonth) => {
      const nextMonth = new Date(currentMonth);
      nextMonth.setMonth(nextMonth.getMonth() + step);
      return nextMonth;
    });
  };

  const handleSelectDate = (date: Date) => {
    onSelectDate(date);
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-center px-5">
        <View className="bg-[#1E293B] rounded-2xl p-5">
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
                date && formatTaskDate(date) === formatTaskDate(selectedDate);

              return (
                <View
                  key={`${date?.toString() ?? "empty"}-${index}`}
                  className="w-[14.28%] p-1"
                >
                  {date ? (
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => handleSelectDate(date)}
                      className={`h-10 rounded-full items-center justify-center ${
                        isSelected ? "bg-purple-500" : "bg-[#0F172A]"
                      }`}
                    >
                      <Text className="text-white font-bold">
                        {date.getDate()}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View className="h-10" />
                  )}
                </View>
              );
            })}
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onClose}
            className="mt-5 h-12 rounded-xl bg-[#0F172A] items-center justify-center"
          >
            <Text className="text-white font-bold">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CalendarModal;
