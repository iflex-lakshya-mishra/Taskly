import { auth } from "@/src/firebase/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

const loginBg = require("../../assets/images/LoginBg.png");

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    const msg = error.message;
    if (msg.includes("email-already-in-use")) return "An account with this email already exists.";
    if (msg.includes("invalid-email")) return "Please enter a valid email address.";
    if (msg.includes("weak-password")) return "Password should be at least 6 characters.";
    if (msg.includes("network-request-failed")) return "Network error. Check your connection.";
    return msg;
  }
  return "Something went wrong. Please try again.";
};

const SignupScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isGoogleLoading = false;

  const handleSignup = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || !password) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }

    try {
      setIsLoading(true);

      // Store display name before creating account
      await AsyncStorage.setItem("current-user-display-name", trimmedName);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        trimmedEmail,
        password
      );

      // Update Firebase profile
      await updateProfile(userCredential.user, { displayName: trimmedName });

      // Store name in multiple formats for reliable retrieval
      await AsyncStorage.setItem(
        `user-display-name-${userCredential.user.uid}`,
        trimmedName
      );
      await AsyncStorage.setItem(
        `user-display-name-${trimmedEmail}`,
        trimmedName
      );

      setName("");
      setEmail("");
      setPassword("");

      router.replace({
        pathname: "/home",
        params: { name: trimmedName },
      });
    } catch (error) {
      Alert.alert("Signup failed", getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  // See LoginScreen.tsx for Google Sign-In setup instructions
  const handleGoogleSignup = async () => {
    Alert.alert(
      "Google Sign-In Setup Required",
      "To enable Google Sign-In:\n\n1. Install expo-auth-session\n2. Configure OAuth in Firebase Console\n3. Add client IDs to .env\n\nSee LoginScreen.tsx comments for details."
    );
  };

  return (
    <ImageBackground source={loginBg} resizeMode="cover" className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.card}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join MyPlan today</Text>

            {/* Name */}
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              placeholder="Enter your name"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
              autoComplete="name"
              returnKeyType="next"
              style={styles.input}
            />

            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <TextInput
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              returnKeyType="next"
              style={styles.input}
            />

            {/* Password */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                placeholder="At least 6 characters"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password-new"
                returnKeyType="done"
                onSubmitEditing={handleSignup}
                style={styles.passwordInput}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              disabled={isLoading}
              onPress={handleSignup}
              style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or sign up with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Button */}
            <TouchableOpacity
              disabled={isGoogleLoading}
              onPress={handleGoogleSignup}
              style={styles.googleButton}
              activeOpacity={0.85}
            >
              {isGoogleLoading ? (
                <ActivityIndicator color="#374151" size="small" />
              ) : (
                <>
                  <View style={styles.googleIconContainer}>
                    <Text style={styles.googleIcon}>G</Text>
                  </View>
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <TouchableOpacity
              onPress={() => router.replace("/login")}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.footerText}>
                Already have an account?{" "}
                <Text style={styles.footerLink}>Log in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 20,
    padding: 24,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: "#111827",
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    paddingVertical: 9,
  },
  primaryButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111827",
    borderRadius: 10,
    height: 50,
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    height: 50,
    gap: 10,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4285F4",
    alignItems: "center",
    justifyContent: "center",
  },
  googleIcon: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  footerText: {
    color: "#6B7280",
    textAlign: "center",
    fontSize: 14,
    marginTop: 4,
  },
  footerLink: {
    color: "#111827",
    fontWeight: "700",
  },
});

export default SignupScreen;
