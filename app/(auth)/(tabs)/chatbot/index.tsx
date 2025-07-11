import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/hooks/auth/useAuthContext";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function ChatbotInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Xin chào! Tôi là trợ lý AI của LUNARIST 🩸\n\nTôi có thể giúp bạn tìm hiểu về quy trình hiến máu, tìm kiếm trung tâm hiến máu gần nhất, hoặc trả lời các câu hỏi về sức khỏe liên quan đến hiến máu.\n\nBạn cần hỗ trợ gì?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const typingInterval = useRef<NodeJS.Timeout | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const isCanceledRef = useRef(false);

  const suggestions = [
    "Làm sao để đăng ký hiến máu?",
    "Hiến máu xong bao lâu thì được hiến lại?",
    "Nhóm máu A có thể cho nhóm nào?",
    "Tôi muốn tìm nơi hiến máu gần nhất.",
  ];

  const { user } = useAuth();
  const socketURL = `${process.env.EXPO_PUBLIC_API_URL_M}/chatbot`;

  useEffect(() => {
    if (!socketRef.current && socketURL) {
      socketRef.current = io(socketURL, {
        transports: ["websocket"],
        auth: {
          userID: user?.user_id || "anonymous",
        },
      });

      socketRef.current.on("aiReply", (data: { message: string }) => {
        if (isCanceledRef.current) return;
        stopTypingAnimation();
        setMessages((prev) => [
          ...prev.filter((msg) => !msg.id.startsWith("typing_")),
          {
            id: Date.now().toString(),
            content: data.message,
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
      });

      socketRef.current.on("connect_error", (err) => {
        console.error("Socket connect error:", err);
      });
    }

    const keyboardDidShow = Keyboard.addListener("keyboardDidShow", () => {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return () => {
      socketRef.current?.disconnect();
      keyboardDidShow.remove();
    };
  }, []);

  const startTypingAnimation = () => {
    isCanceledRef.current = false;
    setIsTyping(true);
    let dots = ".";
    const id = "typing_" + Date.now();
    setMessages((prev) => [
      ...prev,
      { id, content: dots, sender: "bot", timestamp: new Date() },
    ]);

    typingInterval.current = setInterval(() => {
      dots = dots.length === 3 ? "." : dots + ".";
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, content: dots } : msg))
      );
    }, 500) as unknown as NodeJS.Timeout;
  };

  const stopTypingAnimation = () => {
    isCanceledRef.current = true;
    setIsTyping(false);
    if (typingInterval.current) {
      clearInterval(typingInterval.current);
      typingInterval.current = null;
    }
    setMessages((prev) => prev.filter((msg) => !msg.id.startsWith("typing_")));
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const content = inputMessage.trim();
    const message: Message = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, message]);
    setInputMessage("");

    socketRef.current?.emit("askAI", { message: content });
    startTypingAnimation();
  };

  const handleSuggestionClick = (text: string) => {
    setInputMessage(text);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "android" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "android" ? 0 : -48}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContentContainer}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
              setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
              }, 100)
            }
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.sender === "user"
                    ? styles.userBubble
                    : styles.botBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.sender === "user" && styles.userText,
                  ]}
                >
                  {message.content}
                </Text>
                {!message.id.startsWith("typing_") && (
                  <Text
                    style={[
                      styles.timestampText,
                      message.sender === "user" && styles.userTimestampText,
                    ]}
                  >
                    {message.timestamp.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                )}
              </View>
            ))}
          </ScrollView>

          <View style={styles.suggestionsContainer}>
                {suggestions.map((question, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionButton}
                    onPress={() => handleSuggestionClick(question)}
                  >
                    <Text style={styles.suggestionText}>{question}</Text>
                  </TouchableOpacity>
                ))}
              </View>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              {/* Input and Button */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Nhập tin nhắn..."
                  value={inputMessage}
                  onChangeText={setInputMessage}
                  onSubmitEditing={handleSendMessage}
                  returnKeyType="send"
                />
                <TouchableOpacity
                  onPress={isTyping ? stopTypingAnimation : handleSendMessage}
                  style={styles.sendButton}
                  disabled={!inputMessage.trim() && !isTyping}
                >
                  <Ionicons
                    name={isTyping ? "close" : "send"}
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingBottom: -48,
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  scrollContentContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    maxWidth: "80%",
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#EC4899",
  },
  userTimestampText: {
    color: "#fffd",
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  userText: {
    color: "white",
  },
  messageText: {
    color: "#111827",
    fontSize: 14,
  },
  timestampText: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  suggestionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 15,
    paddingBottom: 8,
    paddingTop: 8,
    gap: 8,
  },
  suggestionButton: {
    backgroundColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  suggestionText: {
    fontSize: 13,
    color: "#111827",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#F9FAFB",
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#EC4899",
    padding: 10,
    borderRadius: 20,
  },
}); 