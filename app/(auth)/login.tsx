import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/auth/useAuth";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: -SCREEN_WIDTH,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();
  }, [translateX]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập email và mật khẩu");
      return;
    }

    try {
      const { token, user } = await login(email.trim(), password.trim());
      if (token) {
        router.replace("/(auth)/(tabs)");
      } else {
        Alert.alert("Lỗi", "Không nhận được token từ server");
      }
    } catch (err) {
      console.error("Login error:", err);
      Alert.alert("Thất bại", "Sai tài khoản hoặc lỗi server");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={styles.container}
    >
      {/* Logo */}
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Marquee Text */}
      <View style={styles.marqueeContainer}>
        <Animated.Text
          style={[styles.marqueeText, { transform: [{ translateX }] }]}
          numberOfLines={1}
        >
          🚑 Hệ thống hỗ trợ hiến máu tích hợp chatbot thông minh
        </Animated.Text>
      </View>

      {/* Title */}
      <View>
        <Text style={styles.title}>Đăng Nhập</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#888"
        />
        <TouchableOpacity
          onPress={() => router.push("/(auth)/register")}
          style={styles.forgotBtn}
        >
          <Text style={styles.forgotText}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginBtn}
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.loginText}>Đăng Nhập</Text>
        </TouchableOpacity>

        <View style={styles.registerWrapper}>
          <Text style={{ color: "#666" }}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.registerText}>Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 10,
  },
  marqueeContainer: {
    height: 24,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    justifyContent: "center",
  },
  marqueeText: {
    fontSize: 16,
    color: "#E63946",
    fontWeight: "700",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  form: {
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    color: "#000",
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginBottom: 25,
  },
  forgotText: {
    color: "#E63946",
    fontWeight: "600",
  },
  loginBtn: {
    backgroundColor: "#E63946",
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  loginText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center",
  },
  registerWrapper: {
    flexDirection: "row",
    justifyContent: "center",
  },
  registerText: {
    color: "#E63946",
    fontWeight: "700",
  },
});
