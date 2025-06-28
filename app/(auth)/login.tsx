import { useAuth } from '@/hooks/auth/useAuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
    const { token, user } = await login(email.trim(), password.trim());
      if (token) {
        router.replace("/(auth)/(tabs)");
      } else {
        Alert.alert("Error", "No token received from server");
      }
    } catch (err) {
      console.error("Login error:", err);
      Alert.alert("Failed", "Wrong account or server error");
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#DC143C" />
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={styles.container}
      >
        {/* Header with Logo and Brand */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.brandText}>lunarist</Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>LOGIN</Text>
            <Text style={styles.subtitle}>
              Login to your account and continue reading
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons 
                name="person-outline" 
                size={20} 
                color="#DC143C" 
                style={styles.inputIcon} 
              />
              <TextInput
                style={styles.input}
                placeholder="Username or Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons 
                name="lock-closed-outline" 
                size={20} 
                color="#DC143C" 
                style={styles.inputIcon} 
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color="#DC143C" 
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => router.push("/(auth)/forgot-password")}
              style={styles.forgotBtn}
            >
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.continueBtn}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.continueText}>CONTINUE</Text>
            </TouchableOpacity>

            <View style={styles.registerWrapper}>
              <Text style={styles.registerPrompt}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
                <Text style={styles.registerText}>LOGIN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: SCREEN_HEIGHT * 0.25,
    backgroundColor: "#DC143C", // Darker red
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  brandText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  content: {
    flex: 1,
    paddingHorizontal: 50,
    paddingTop: 50,
  },
  titleSection: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: "#FAFAFA",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    padding: 5,
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  forgotText: {
    color: "#DC143C", // Darker red
    fontWeight: "600",
    fontSize: 14,
  },
  continueBtn: {
    backgroundColor: "#DC143C", // Darker red
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: "#DC143C", // Darker red
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
    letterSpacing: 1,
  },
  registerWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerPrompt: {
    color: "#666",
    fontSize: 14,
  },
  registerText: {
    color: "#DC143C", // Darker red
    fontWeight: "700",
    fontSize: 14,
  },
});