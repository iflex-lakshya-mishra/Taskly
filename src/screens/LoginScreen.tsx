import { auth } from "@/src/firebase/config";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
    GoogleAuthProvider,
    signInWithCredential,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { useEffect, useState } from "react";
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

WebBrowser.maybeCompleteAuthSession();

const getErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : "Please try again.";
};

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    const signInWithGoogle = async () => {
      if (response?.type !== "success") {
        return;
      }

      const idToken =
        response.authentication?.idToken || response.params?.id_token;

      if (!idToken) {
        Alert.alert("Google login failed", "Missing Google token.");
        return;
      }

      try {
        setIsGoogleLoading(true);
        const credential = GoogleAuthProvider.credential(idToken);
        const userCredential = await signInWithCredential(auth, credential);
        const displayName = userCredential.user.displayName;

        if (displayName) {
          await AsyncStorage.setItem("current-user-display-name", displayName);
        }

        router.replace("/home");
      } catch (error) {
        Alert.alert("Google login failed", getErrorMessage(error));
      } finally {
        setIsGoogleLoading(false);
      }
    };

    void signInWithGoogle();
  }, [response]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Enter email and password");
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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const storedName = await AsyncStorage.getItem(
        `user-display-name-${email.trim().toLowerCase()}`,
      );
      const displayName = userCredential.user.displayName || storedName;

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

  const handleGoogleLogin = async () => {
    if (!request) {
      Alert.alert(
        "Google login unavailable",
        "Set the Google client IDs in your environment variables first.",
      );
      return;
    }

    try {
      await promptAsync();
    } catch (error) {
      Alert.alert("Google login failed", getErrorMessage(error));
    }
  };

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
            <Text className="text-3xl font-bold">Login</Text>
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
              onPress={handleLogin}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>
                {isLoading ? "Logging in..." : "Login"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={isGoogleLoading}
              onPress={handleGoogleLogin}
              style={styles.googleButton}
            >
              <Text style={styles.googleButtonText}>
                {isGoogleLoading ? "Signing in..." : "Continue with Google"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/signup")}>
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
  googleButton: {
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "#D1D5DB",
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
  },
  googleButtonText: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginScreen;
