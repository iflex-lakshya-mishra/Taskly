import BottomNavigation from "@/src/components/BottomNavigation";
import { auth } from "@/src/firebase/config";
import { useTasks } from "@/src/utils/useTasks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { signOut, updateProfile } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Settings = () => {
  const { clearTasks, stats } = useTasks();
  const user = auth.currentUser;
  const [name, setName] = useState(user?.displayName || "");
  const [isSaving, setIsSaving] = useState(false);

  // Sync name from AsyncStorage if Firebase displayName is empty
  useEffect(() => {
    if (!name && user) {
      AsyncStorage.getItem(`user-display-name-${user.uid}`).then((stored) => {
        if (stored) setName(stored);
      });
    }
  }, []);

  const handleSaveName = async () => {
    const displayName = name.trim();
    if (!displayName) {
      Alert.alert("Error", "Please enter your name.");
      return;
    }

    if (!auth.currentUser) return;

    try {
      setIsSaving(true);
      await updateProfile(auth.currentUser, { displayName });
      await AsyncStorage.setItem("current-user-display-name", displayName);
      await AsyncStorage.setItem(
        `user-display-name-${auth.currentUser.uid}`,
        displayName
      );
      if (auth.currentUser.email) {
        await AsyncStorage.setItem(
          `user-display-name-${auth.currentUser.email.toLowerCase()}`,
          displayName
        );
      }
      Alert.alert("Saved", "Your name has been updated.");
    } catch {
      Alert.alert("Error", "Could not update your name. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearTasks = () => {
    Alert.alert(
      "Clear All Tasks",
      `This will delete all ${stats.totalTasks} task(s). This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: clearTasks,
        },
      ]
    );
  };

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("current-user-display-name");
            await signOut(auth);
            router.replace("/login");
          } catch {
            Alert.alert("Error", "Could not sign out. Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Settings</Text>

        {/* Account Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-circle-outline" size={18} color="#9CA3AF" />
            <Text style={styles.sectionLabel}>Account</Text>
          </View>

          <Text style={styles.fieldLabel}>Display Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#6B7280"
            style={styles.textInput}
            returnKeyType="done"
            onSubmitEditing={handleSaveName}
          />

          <Text style={styles.emailText}>
            {user?.email || "No email associated"}
          </Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{stats.totalTasks}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: "#22C55E" }]}>{stats.completedTasks}</Text>
              <Text style={styles.statLabel}>Done</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: "#F59E0B" }]}>{stats.pendingTasks}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSaveName}
            disabled={isSaving}
            style={[styles.saveButton, isSaving && { opacity: 0.65 }]}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? "Saving..." : "Save Name"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle-outline" size={18} color="#9CA3AF" />
            <Text style={styles.sectionLabel}>About</Text>
          </View>
          <Text style={styles.infoText}>
            Tasks are saved locally per user account. Tap any task to mark it done or pending.
          </Text>
          <Text style={styles.infoText}>
            Your data stays on this device and is linked to your account.
          </Text>
        </View>

        {/* Danger Zone */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleClearTasks}
          style={styles.clearButton}
        >
          <Ionicons name="trash-outline" size={18} color="#FCA5A5" />
          <Text style={styles.clearButtonText}>Clear All Tasks</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSignOut}
          style={styles.signOutButton}
        >
          <Ionicons name="log-out-outline" size={18} color="#fff" />
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#161622",
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 12,
  },
  pageTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 8,
  },
  section: {
    backgroundColor: "#1E293B",
    borderRadius: 16,
    padding: 18,
    gap: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  sectionLabel: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  fieldLabel: {
    color: "#D1D5DB",
    fontSize: 13,
    fontWeight: "500",
  },
  textInput: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    backgroundColor: "#0F172A",
  },
  emailText: {
    color: "#64748B",
    fontSize: 13,
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#0F172A",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 10,
  },
  statValue: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "800",
  },
  statLabel: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 2,
  },
  saveButton: {
    height: 46,
    borderRadius: 10,
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  infoText: {
    color: "#94A3B8",
    fontSize: 13,
    lineHeight: 20,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: 12,
    backgroundColor: "rgba(239,68,68,0.12)",
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  clearButtonText: {
    color: "#FCA5A5",
    fontWeight: "700",
    fontSize: 15,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#7C3AED",
  },
  signOutButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});

export default Settings;
