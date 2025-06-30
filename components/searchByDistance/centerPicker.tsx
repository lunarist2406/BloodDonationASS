import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Animated, Modal, FlatList, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

interface Center {
  centralBlood_id: number
  centralBlood_name: string
}

interface CenterPickerProps {
  central: Center[]
  selectedCenter: string | null
  useCurrentLocation: boolean
  onCenterChange: (value: string | null) => void
  onClearSelection: () => void
}

export default function CenterPicker({
  central,
  selectedCenter,
  useCurrentLocation,
  onCenterChange,
  onClearSelection,
}: CenterPickerProps) {
  const [showModal, setShowModal] = useState(false)
  const [scaleAnim] = useState(new Animated.Value(1))

  const selectedCenterName = central.find((c) => c.centralBlood_id.toString() === selectedCenter)?.centralBlood_name

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()

    setShowModal(true)
  }

  const handleCenterSelect = (center: Center) => {
    onCenterChange(center.centralBlood_id.toString())
    setShowModal(false)
  }

  const renderCenterItem = ({ item }: { item: Center }) => (
    <TouchableOpacity
      style={[styles.centerItem, selectedCenter === item.centralBlood_id.toString() && styles.selectedCenterItem]}
      onPress={() => handleCenterSelect(item)}
    >
      <View style={styles.centerItemContent}>
        <View style={styles.centerIcon}>
          <Ionicons
            name="medical"
            size={20}
            color={selectedCenter === item.centralBlood_id.toString() ? "#FF00BA" : "#e11d48"}
          />
        </View>
        <Text
          style={[
            styles.centerItemText,
            selectedCenter === item.centralBlood_id.toString() && styles.selectedCenterItemText,
          ]}
        >
          {item.centralBlood_name}
        </Text>
        {selectedCenter === item.centralBlood_id.toString() && (
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
        )}
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="business" size={20} color="#e11d48" />
        </View>
        <Text style={styles.headerText}>Chọn trung tâm</Text>
      </View>

      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          style={[
            styles.pickerButton,
            selectedCenter && styles.pickerButtonSelected,
            useCurrentLocation && styles.pickerButtonDisabled,
          ]}
          onPress={handlePress}
          disabled={useCurrentLocation}
        >
          <View style={styles.pickerButtonContent}>
            <View style={styles.pickerButtonLeft}>
              <Ionicons
                name={selectedCenter ? "location" : "add-circle-outline"}
                size={20}
                color={useCurrentLocation ? "#9ca3af" : selectedCenter ? "#e11d48" : "#6b7280"}
              />
              <Text
                style={[
                  styles.pickerButtonText,
                  selectedCenter && styles.pickerButtonTextSelected,
                  useCurrentLocation && styles.pickerButtonTextDisabled,
                ]}
              >
                {selectedCenterName || "Chọn trung tâm hiến máu"}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={20} color={useCurrentLocation ? "#9ca3af" : "#6b7280"} />
          </View>
        </TouchableOpacity>
      </Animated.View>

      {selectedCenter && !useCurrentLocation && (
        <TouchableOpacity style={styles.clearButton} onPress={onClearSelection}>
          <Ionicons name="close-circle" size={16} color="#ef4444" />
          <Text style={styles.clearButtonText}>Bỏ chọn trung tâm</Text>
        </TouchableOpacity>
      )}

      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Chọn trung tâm hiến máu</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={central}
              renderItem={renderCenterItem}
              keyExtractor={(item) => item.centralBlood_id.toString()}
              style={styles.centerList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fce7f3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  pickerButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  pickerButtonSelected: {
    borderColor: "#e11d48",
    backgroundColor: "#fef7f7",
  },
  pickerButtonDisabled: {
    backgroundColor: "#f9fafb",
    borderColor: "#e5e7eb",
  },
  pickerButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerButtonLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  pickerButtonText: {
    fontSize: 15,
    color: "#6b7280",
    marginLeft: 12,
    flex: 1,
  },
  pickerButtonTextSelected: {
    color: "#1f2937",
    fontWeight: "500",
  },
  pickerButtonTextDisabled: {
    color: "#9ca3af",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    paddingVertical: 8,
  },
  clearButtonText: {
    fontSize: 14,
    color: "#ef4444",
    marginLeft: 6,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  closeButton: {
    padding: 4,
  },
  centerList: {
    paddingHorizontal: 20,
  },
  centerItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginVertical: 6,
    overflow: "hidden",
  },
  selectedCenterItem: {
    backgroundColor: "#e11d48",
    borderColor: "#e11d48",
  },
  centerItemContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  centerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fce7f3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  centerItemText: {
    fontSize: 15,
    color: "#1f2937",
    fontWeight: "500",
    flex: 1,
  },
  selectedCenterItemText: {
    color: "#fff",
  },
})
