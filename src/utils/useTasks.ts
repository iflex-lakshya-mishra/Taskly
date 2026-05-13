import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";

export type TaskPriority = "Low" | "Normal" | "Urgent";

export type Task = {
  id: string;
  title: string;
  note: string;
  date: string;
  priority: TaskPriority;
  completed: boolean;
  createdAt: string;
};

type CreateTaskInput = {
  title: string;
  note: string;
  date: string;
  priority: TaskPriority;
};

const TASKS_STORAGE_KEY = "taskly-tasks";
const LEGACY_TASKS_STORAGE_KEY = "my" + "plan-tasks";
const listeners = new Set<(tasks: Task[]) => void>();

const emitTasks = (tasks: Task[]) => {
  listeners.forEach((listener) => listener(tasks));
};

const readTasks = async () => {
  const rawTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
  if (rawTasks) {
    try {
      return JSON.parse(rawTasks) as Task[];
    } catch {
      return [];
    }
  }

  const legacyTasks = await AsyncStorage.getItem(LEGACY_TASKS_STORAGE_KEY);
  if (!legacyTasks) {
    return [];
  }

  try {
    const parsedTasks = JSON.parse(legacyTasks) as Task[];
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, legacyTasks);
    return parsedTasks;
  } catch {
    return [];
  }
};

const writeTasks = async (tasks: Task[]) => {
  await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  emitTasks(tasks);
};

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshTasks = useCallback(async () => {
    try {
      const savedTasks = await readTasks();
      setTasks(savedTasks);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTasks();
    listeners.add(setTasks);

    return () => {
      listeners.delete(setTasks);
    };
  }, [refreshTasks]);

  const addTask = useCallback(async (taskInput: CreateTaskInput) => {
    const savedTasks = await readTasks();
    const newTask: Task = {
      ...taskInput,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    await writeTasks([newTask, ...savedTasks]);
    return newTask;
  }, []);

  const toggleTaskComplete = useCallback(async (taskId: string) => {
    const savedTasks = await readTasks();
    const updatedTasks = savedTasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    await writeTasks(updatedTasks);
  }, []);

  const clearTasks = useCallback(async () => {
    await writeTasks([]);
  }, []);

  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      progress,
    };
  }, [tasks]);

  return {
    tasks,
    isLoading,
    stats,
    addTask,
    toggleTaskComplete,
    clearTasks,
    refreshTasks,
  };
};
