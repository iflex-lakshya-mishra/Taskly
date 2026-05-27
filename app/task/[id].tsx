import PrioritySelector from "@/src/components/PrioritySelector";
import { TaskPriority, useTasks } from "@/src/utils/useTasks";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const isValidDateKey = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

export default function TaskDetailScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const taskId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { isLoading, tasks, updateTask, toggleTaskComplete, deleteTask } =
    useTasks();

  const task = useMemo(
    () => tasks.find((item) => item.id === taskId),
    [taskId, tasks]
  );

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Normal");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!task) return;

    setTitle(task.title);
    setNote(task.note);
    setDate(task.date);
    setPriority(task.priority);
  }, [task]);

  const handleSave = async () => {
    if (!task) return;

    const nextTitle = title.trim();
    const nextDate = date.trim();

    if (!nextTitle) {
      Alert.alert("Title required", "Please enter a task title.");
      return;
    }

    if (!isValidDateKey(nextDate)) {
      Alert.alert("Invalid date", "Use date format YYYY-MM-DD.");
      return;
    }

    try {
      setIsSaving(true);
      await updateTask(task.id, {
        title: nextTitle,
        note: note.trim(),
        date: nextDate,
        priority,
      });
      Alert.alert("Saved", "Task updated successfully.");
    } catch {
      Alert.alert("Error", "Could not update task. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleComplete = async () => {
    if (!task) return;

    try {
      await toggleTaskComplete(task.id);
    } catch {
      Alert.alert("Error", "Could not update task status.");
    }
  };

  const handleDelete = () => {
    if (!task) return;

    Alert.alert("Delete Task", "This task will be permanently deleted.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTask(task.id);
            router.back();
          } catch {
            Alert.alert("Error", "Could not delete task.");
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.centerScreen}>
        <ActivityIndicator color="#A855F7" size="large" />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.centerScreen}>
        <Text style={styles.emptyTitle}>Task not found</Text>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.back()}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 28 },
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.back()}
            style={styles.iconButton}
          >
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Task Details</Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleDelete}
            style={[styles.iconButton, styles.deleteIconButton]}
          >
            <Ionicons name="trash-outline" size={20} color="#FCA5A5" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleToggleComplete}
          style={[
            styles.statusCard,
            task.completed ? styles.statusDone : styles.statusPending,
          ]}
        >
          <View style={styles.statusIcon}>
            <Ionicons
              name={task.completed ? "checkmark" : "time-outline"}
              size={22}
              color="#FFFFFF"
            />
          </View>
          <View style={styles.statusTextWrap}>
            <Text style={styles.statusLabel}>Status</Text>
            <Text style={styles.statusTitle}>
              {task.completed ? "Completed" : "Pending"}
            </Text>
          </View>
          <Text style={styles.statusAction}>Tap to change</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Task title"
            placeholderTextColor="#64748B"
            style={styles.input}
            returnKeyType="next"
          />

          <Text style={styles.label}>Note</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Add details"
            placeholderTextColor="#64748B"
            multiline
            textAlignVertical="top"
            style={[styles.input, styles.noteInput]}
          />

          <Text style={styles.label}>Date</Text>
          <TextInput
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#64748B"
            autoCapitalize="none"
            style={styles.input}
          />

          <Text style={styles.label}>Priority</Text>
          <PrioritySelector priority={priority} onChangePriority={setPriority} />
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          disabled={isSaving}
          onPress={handleSave}
          style={[styles.saveButton, isSaving && styles.disabledButton]}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#161622",
  },
  content: {
    paddingHorizontal: 20,
    gap: 18,
  },
  centerScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#161622",
    paddingHorizontal: 24,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E293B",
  },
  deleteIconButton: {
    backgroundColor: "rgba(239,68,68,0.12)",
    borderWidth: 1,
    borderColor: "#7F1D1D",
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  statusDone: {
    backgroundColor: "#16A34A",
  },
  statusPending: {
    backgroundColor: "#7C3AED",
  },
  statusIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  statusTextWrap: {
    flex: 1,
  },
  statusLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  statusTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 2,
  },
  statusAction: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontWeight: "700",
  },
  section: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  label: {
    color: "#CBD5E1",
    fontSize: 13,
    fontWeight: "700",
  },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    backgroundColor: "#0F172A",
    color: "#FFFFFF",
    paddingHorizontal: 14,
    fontSize: 15,
  },
  noteInput: {
    minHeight: 120,
    paddingTop: 12,
    paddingBottom: 12,
  },
  saveButton: {
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#A855F7",
  },
  disabledButton: {
    opacity: 0.65,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },
  secondaryButton: {
    height: 48,
    paddingHorizontal: 22,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E293B",
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});
