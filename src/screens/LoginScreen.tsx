import { auth } from "@/src/firebase/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
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

// For Google Sign-In on native, install expo-auth-session:
// npx expo install expo-auth-session expo-crypto
// Then configure Google OAuth in Firebase console & app.json
// import * as Google from "expo-auth-session/providers/google";

const loginBg = require("../../assets/images/LoginBg.png");

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    // Make Firebase error messages user-friendly
    const msg = error.message;
    if (msg.includes("user-not-found")) return "No account found with this email.";
    if (msg.includes("wrong-password")) return "Incorrect password. Please try again.";
    if (msg.includes("too-many-requests")) return "Too many attempts. Please try again later.";
    if (msg.includes("network-request-failed")) return "Network error. Check your connection.";
    return msg;
  }
  return "Something went wrong. Please try again.";
};

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isGoogleLoading = false;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing fields", "Please enter both email and password.");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Weak password", "Password must be at least 6 characters.");
      return;
    }

    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );

      // Resolve display name from multiple sources
      const storedName = await AsyncStorage.getItem(
        `user-display-name-${email.trim().toLowerCase()}`
      );
      const displayName =
        userCredential.user.displayName || storedName || "";

      if (displayName) {
        await AsyncStorage.setItem("current-user-display-name", displayName);
      }

      setEmail("");
      setPassword("");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Login failed", getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign-In handler
  // To fully enable Google Sign-In:
  // 1. Run: npx expo install expo-auth-session expo-crypto
  // 2. Add to app.json scheme: "myplan"
  // 3. Add OAuth client IDs from Firebase console to .env:
  //    EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=...
  //    EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=...
  //    EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=...
  // 4. Uncomment the Google hooks at the top of this file
  const handleGoogleLogin = async () => {
    Alert.alert(
      "Google Sign-In Setup Required",
      "To enable Google Sign-In:\n\n1. Install expo-auth-session\n2. Configure OAuth in Firebase Console\n3. Add client IDs to .env\n\nSee LoginScreen.tsx comments for details."
    );
    // --- Uncomment below after setup ---
    // setIsGoogleLoading(true);
    // try {
    //   const [request, response, promptAsync] = Google.useAuthRequest({...});
    //   const result = await promptAsync();
    //   if (result.type === "success") {
    //     const { id_token } = result.params;
    //     const credential = GoogleAuthProvider.credential(id_token);
    //     const userCredential = await signInWithCredential(auth, credential);
    //     const displayName = userCredential.user.displayName || "";
    //     if (displayName) {
    //       await AsyncStorage.setItem("current-user-display-name", displayName);
    //     }
    //     router.replace("/home");
    //   }
    // } catch (error) {
    //   Alert.alert("Google Sign-In failed", getErrorMessage(error));
    // } finally {
    //   setIsGoogleLoading(false);
    // }
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

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
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
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

            {/* Login Button */}
            <TouchableOpacity
              disabled={isLoading}
              onPress={handleLogin}
              style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Login Button */}
            <TouchableOpacity
              disabled={isGoogleLoading}
              onPress={handleGoogleLogin}
              style={styles.googleButton}
              activeOpacity={0.85}
            >
              {isGoogleLoading ? (
                <ActivityIndicator color="#374151" size="small" />
              ) : (
                <>
                  {/* Google "G" icon using text */}
                  <View style={styles.googleIconContainer}>
                    <Text style={styles.googleIcon}>G</Text>
                  </View>
                  <Text style={styles.googleButtonText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <TouchableOpacity
              onPress={() => router.push("/signup")}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.footerText}>
                {"Don't have an account? "}
                <Text style={styles.footerLink}>Sign Up</Text>
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

export default LoginScreen;
