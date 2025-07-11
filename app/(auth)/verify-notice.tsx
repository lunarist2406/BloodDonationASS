import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import api from "@/config/axiosInstance"; // hoặc thay bằng axios phù hợp

export default function VerifyNoticeScreen() {
  const { email, message } = useLocalSearchParams();
  const [counter, setCounter] = useState(15);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (counter > 0) {
      timer = setTimeout(() => setCounter(counter - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [counter]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác nhận Email</Text>
      <Text style={styles.message}>
        {message || "Mã xác nhận đã được gửi. Vui lòng kiểm tra email của bạn."}
      </Text>

      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.push("/(auth)/login")}
      >
        <Text style={styles.backText}>Quay về đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#DC143C",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
  },
  resendButton: {
    backgroundColor: "#DC143C",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
  },
  resendText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledBtn: {
    backgroundColor: "#999",
  },
  backBtn: {
    paddingVertical: 10,
  },
  backText: {
    color: "#DC143C",
    fontSize: 15,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
