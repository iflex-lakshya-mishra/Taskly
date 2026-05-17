import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  selectedDate: string; // ISO date string e.g. "2026-05-17"
  onSelectDate: (date: string) => void;
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const toISO = (d: Date) => d.toISOString().split("T")[0];

const WeekStrip = ({ selectedDate, onSelectDate }: Props) => {
  const days = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const result = [];
    // Show 3 days before today and 3 days after (7 total)
    for (let i = -3; i <= 3; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      result.push(d);
    }
    return result;
  }, []);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.strip}
    >
      {days.map((date) => {
        const iso = toISO(date);
        const isSelected = iso === selectedDate;
        const isToday = iso === toISO(new Date());

        return (
          <TouchableOpacity
            key={iso}
            onPress={() => onSelectDate(iso)}
            activeOpacity={0.75}
            style={[
              styles.dayBox,
              isSelected && styles.selectedBox,
            ]}
          >
            <Text style={[styles.dayName, isSelected && styles.selectedText]}>
              {DAYS[date.getDay()]}
            </Text>
            <Text style={[styles.dayNum, isSelected && styles.selectedText]}>
              {date.getDate()}
            </Text>
            {isToday && !isSelected && <View style={styles.todayDot} />}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  strip: {
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 8,
  },
  dayBox: {
    width: 48,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#1E293B",
  },
  selectedBox: {
    backgroundColor: "#7C3AED",
  },
  dayName: {
    color: "#64748B",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  dayNum: {
    color: "#F1F5F9",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 2,
  },
  selectedText: {
    color: "#fff",
  },
  todayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#7C3AED",
    marginTop: 3,
  },
});

export default WeekStrip;
