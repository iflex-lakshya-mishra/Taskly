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
} from "react-native";

const loginBg = require("../../assets/images/LoginBg.png");

const getErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : "Please try again.";
};

const SignupScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignup() {
    if (!email || !password || !name) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Enter a valid email address");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      setIsLoading(true);
      const displayName = name.trim();
      await AsyncStorage.setItem("current-user-display-name", displayName);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, { displayName });
      await AsyncStorage.setItem(
        `user-display-name-${userCredential.user.uid}`,
        displayName
      );
      await AsyncStorage.setItem(
        `user-display-name-${email.trim().toLowerCase()}`,
        displayName
      );

      setName("");
      setEmail("");
      setPassword("");
      router.replace({
        pathname: "/home",
        params: { name: displayName },
      });
    } catch (error) {
      Alert.alert("Signup failed", getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ImageBackground source={loginBg} resizeMode="cover" className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="flex-grow justify-center bg-white/25 p-6"
        >
          <View pointerEvents="box-none" className="gap-4">
            <Text className="text-3xl font-bold">Sign up</Text>
            <Text className="text-2xl font-normal">Name</Text>
            <TextInput
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              className="border border-gray-300 rounded-lg bg-white/80 p-3"
            />
            <Text className="text-2xl font-normal">Email</Text>
            <TextInput
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              className="border border-gray-300 rounded-lg bg-white/80 p-3"
            />
            <Text className="text-2xl font-normal">Password</Text>
            <View className="flex-row items-center border border-gray-300 rounded-lg bg-white/80 px-3 py-1">
              <TextInput
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                className="flex-1 py-3"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="ml-2"
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#111827"
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              disabled={isLoading}
              onPress={handleSignup}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>
                {isLoading ? "Creating account..." : "Sign up"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.replace("/login")}>
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
  footerLink: {
    color: "#111827",
    fontWeight: "bold",
  },
  footerText: {
    color: "#374151",
    textAlign: "center",
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 8,
    padding: 14,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignupScreen;
