import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const loginBg = require("../assets/images/LoginBg.png");

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Enter email & password");
      return;
    }
    const regex = /\S+@\S+\.\S+/;
    if (!regex.test(email)) {
      Alert.alert("Error", "Invalid email format");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    setEmail("");
    setPassword("");

    router.replace("/home");
  };
  return (
    <ImageBackground source={loginBg} resizeMode="cover" className="flex-1">
      <View
        pointerEvents="box-none"
        className="flex-1 justify-center bg-white/25 p-6"
      >
        <View pointerEvents="box-none" className="gap-4">
          <Text className="text-3xl font-bold">Login</Text>
          <Text className="text-2xl font-normal">Email</Text>
          <TextInput
            placeholder="Enter Your Email"
            value={email}
            onChangeText={setEmail}
            className="border border-gray-300 rounded-lg bg-white/80 p-3"
          />
          <Text className="text-2xl font-normal">Password</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg bg-white/80 px-3 py-1">
            <TextInput
              placeholder="Enter Your Password"
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
            onPress={handleLogin}
            style={{
              backgroundColor: "#111827",
              padding: 14,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={{ textAlign: "center", color: "#374151" }}>
              Don`t have an account?{" "}
              <Text style={{ color: "#111827", fontWeight: "bold" }}>
                Sign Up
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

export default Login;
