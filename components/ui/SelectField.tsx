import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function SelectField({
  icon,
  selectedValue,
  onValueChange,
  options,
  placeholder,
  fullWidth = false,
  disabled = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}) {
  return (
    <View style={[styles.container, fullWidth && styles.fullWidth]}>
      <Ionicons name={icon} size={20} color="#DC143C" style={styles.icon} />
      <View style={styles.pickerWrapper}>
        <Picker
          enabled={!disabled}
          selectedValue={selectedValue || "__placeholder__"}
          onValueChange={(value) => {
            if (value !== "__placeholder__") {
              onValueChange(value);
            }
          }}
          style={[
            styles.picker,
            {
              color:
                selectedValue && selectedValue !== "__placeholder__"
                  ? "#333"
                  : "#999",
            },
          ]}
          dropdownIconColor="#DC143C"
        >
          <Picker.Item
            label={placeholder}
            style={styles.placeholderText}
            value="__placeholder__"
            enabled={false}
          />
          {options.map((opt) => (
            <Picker.Item
              key={opt.value}
              label={opt.label}
              value={opt.value}
              style={styles.haveValuetext}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  placeholderText: {
    fontSize: 14,
    display: "flex",
    alignItems: "center",
  },

  haveValuetext: {
    fontSize: 14,
    display: "flex",
    alignItems: "center",
  },
  fullWidth: {
    width: "100%",
  },
  icon: {
    marginRight: 8,
  },
  pickerWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  picker: {
    width: "130%",
    height: 55,
    color: "#999",
    marginLeft: -12,
  },
});
