import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Task } from "@/src/utils/useTasks";

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
};

const priorityColor = (priority: Task["priority"]) => {
  switch (priority) {
    case "Urgent": return "#EF4444";
    case "Normal": return "#F59E0B";
    case "Low":    return "#22C55E";
    default:       return "#9CA3AF";
  }
};

const TaskItem = ({ task, onToggle, onDelete }: Props) => {
  return (
    <TouchableOpacity
      onPress={() => onToggle(task.id)}
      activeOpacity={0.75}
      style={styles.container}
    >
      {/* Checkbox */}
      <View style={[styles.checkbox, task.completed && styles.checkboxDone]}>
        {task.completed && (
          <Ionicons name="checkmark" size={14} color="#fff" />
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text
          style={[styles.title, task.completed && styles.titleDone]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        {task.note ? (
          <Text style={styles.note} numberOfLines={1}>
            {task.note}
          </Text>
        ) : null}
        <View style={styles.meta}>
          <Text style={styles.date}>{task.date}</Text>
          <View
            style={[
              styles.priorityBadge,
              { backgroundColor: priorityColor(task.priority) + "22" },
            ]}
          >
            <Text
              style={[styles.priorityText, { color: priorityColor(task.priority) }]}
            >
              {task.priority}
            </Text>
          </View>
        </View>
      </View>

      {/* Delete button */}
      {onDelete && (
        <TouchableOpacity
          onPress={() => onDelete(task.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.deleteBtn}
        >
          <Ionicons name="trash-outline" size={16} color="#64748B" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#475569",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: {
    backgroundColor: "#7C3AED",
    borderColor: "#7C3AED",
  },
  content: {
    flex: 1,
    gap: 3,
  },
  title: {
    color: "#F1F5F9",
    fontSize: 15,
    fontWeight: "600",
  },
  titleDone: {
    color: "#64748B",
    textDecorationLine: "line-through",
  },
  note: {
    color: "#94A3B8",
    fontSize: 13,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  date: {
    color: "#64748B",
    fontSize: 12,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "700",
  },
  deleteBtn: {
    padding: 4,
  },
});

export default TaskItem;
