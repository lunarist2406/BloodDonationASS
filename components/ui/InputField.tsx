import { Ionicons } from "@expo/vector-icons";
import {
  TextInput,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

type InputFieldProps = {
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  fullWidth?: boolean;
  type?: "text";
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  options?: { label: string; value: string }[];
  showToggle?: boolean;
  onToggleSecureEntry?: () => void;
};

export default function InputField({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  fullWidth = false,
  type = "text",
  keyboardType = "default",
  showToggle = false,
  onToggleSecureEntry,
}: InputFieldProps) {
  return (
    <View
      style={[
        styles.inputContainer,
        fullWidth && styles.fullWidthInputContainer,
      ]}
    >
      <Ionicons
        name={icon}
        size={20}
        color="#DC143C"
        style={styles.inputIcon}
      />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        style={styles.input}
        autoCapitalize={keyboardType === "email-address" ? "none" : "sentences"}
      />
      {showToggle && (
        <TouchableOpacity onPress={onToggleSecureEntry} style={styles.eyeIcon}>
          <Ionicons
            name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#DC143C"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: (SCREEN_WIDTH - 60) / 2,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderColor: "#E5E5E5",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  fullWidthInputContainer: {
    width: "100%",
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    color: "#333",
  },
  eyeIcon: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
});
