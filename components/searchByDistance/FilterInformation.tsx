import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { ToastAndroid } from "react-native";
import type { BloodDonationData } from "@/hooks/searchByDistance/useSearchByDistanceFilter";
import useCentral from "@/hooks/central/useCentral";
import useSearchByDistanceService from "@/hooks/searchByDistance/useSearchByDistanceService";
import CenterPicker from "./centerPicker";
import { useLocationPermission } from "@/hooks/location/locationPermissionContext";

interface FilterInformationUIProps {
  selectedTypes: string[];
  distanceKm: number;
  selectedCenter: string | null;
  onTypeChange: (types: string[]) => void;
  onDistanceChange: (distance: number) => void;
  onCenterChange: (center: string | null) => void;
  onUseCurrentLocationChange?: (
    coords: { lat: number; lng: number } | null
  ) => void;
  setData: (data: BloodDonationData[]) => void;
  originalData: BloodDonationData[];
  useCurrentLocation: boolean,
  setUseCurrentLocation: (isUse: boolean) => void;
}

export default function FilterInformationUI({
  selectedTypes,
  distanceKm,
  selectedCenter,
  onTypeChange,
  onDistanceChange,
  onCenterChange,
  onUseCurrentLocationChange,
  setData,
  useCurrentLocation,
  setUseCurrentLocation,
  originalData,
}: FilterInformationUIProps) {
  const { central } = useCentral();
  const { searchByCurrentPosition, searchByCentralDistance } =
    useSearchByDistanceService();
  const [loadingLocation, setLoadingLocation] = useState(false);
  const { locationAllowed, setLocationAllowed } = useLocationPermission();
  const [showPicker, setShowPicker] = useState(false);

  const handleUseLocationChange = async (checked: boolean) => {
  if (!checked) {
    onCenterChange(null);
    setUseCurrentLocation(false);
    onUseCurrentLocationChange?.(null);
    setData(originalData);
    return;
  }

  if (!locationAllowed) {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      ToastAndroid.show("Bạn đã từ chối truy cập vị trí.", ToastAndroid.SHORT);
      setUseCurrentLocation(false);
      setLocationAllowed(false);
      return;
    }else{
      setLocationAllowed(true);
    }
  }

  if (selectedCenter) {
    onCenterChange(null);
  }

  setLoadingLocation(true);

  try {
    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    setUseCurrentLocation(true);
    onUseCurrentLocationChange?.({ lat: latitude, lng: longitude });
    console.warn("lat: " + latitude + ",lng: " + longitude);

    const objectSearch = {
      lat: latitude,
      lng: longitude,
      radiusInKm: distanceKm || 10,
    };

    const response = await searchByCurrentPosition(objectSearch);
    if (response && response.data) {
      setData(response.data);
    } else {
      ToastAndroid.show("Lỗi dữ liệu trả về.", ToastAndroid.SHORT);
    }
  } catch (err) {
    ToastAndroid.show("Không thể lấy vị trí. Vui lòng thử lại.", ToastAndroid.SHORT);
    setUseCurrentLocation(false);
    onUseCurrentLocationChange?.(null);
  } finally {
    setLoadingLocation(false);
  }
};

  const handleAllowClear = () => {
    setShowPicker(false);
    onCenterChange(null);
    setData(originalData);
  };

  const handleCenterChange = async (center: string | null) => {
    onCenterChange(center);

    if (!center) {
      setData(originalData);
      return;
    }

    setUseCurrentLocation(false);
    onUseCurrentLocationChange?.(null);

    try {
      const response = await searchByCentralDistance({
        central_id: center,
        radiusInKm: distanceKm,
      });
      setData(response.data);
    } catch (err) {
      ToastAndroid.show(
        "Không thể tìm theo trung tâm. Vui lòng thử lại.",
        ToastAndroid.SHORT
      );
    }
  };

  useEffect(() => {
    if(!locationAllowed){
      setUseCurrentLocation(false);
    }
  }, [locationAllowed])

  useEffect(() => {
    if (!useCurrentLocation && !selectedCenter) {
      setData(originalData); 
      onUseCurrentLocationChange?.(null);
    }
  }, [useCurrentLocation, selectedCenter, originalData]);

  const roleOptions = [
    { key: "hien", label: "Hiến máu", icon: "heart", color: "#EC4899" },
    { key: "can", label: "Nhận máu", icon: "medical", color: "#EF4444" },
    {
      key: "lichsu",
      label: "Đã hiến và cần máu",
      icon: "refresh",
      color: "#8B5CF6",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bộ lọc thông tin</Text>
        <Text style={styles.headerSubtitle}>Tìm kiếm theo khoảng cách</Text>
      </View>

      {/* Location Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="location" size={24} color="#EC4899" />
          <Text style={styles.cardTitle}>Vị trí tìm kiếm</Text>
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchRow}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchLabel}>Sử dụng vị trí hiện tại</Text>
              <Text style={styles.switchDescription}>
                Tìm kiếm dựa trên GPS của bạn
              </Text>
            </View>
            <View style={styles.switchWrapper}>
              <Switch
                value={useCurrentLocation}
                onValueChange={handleUseLocationChange}
                disabled={loadingLocation}
                trackColor={{ false: "#E5E7EB", true: "#FEE2E2" }}
                thumbColor={useCurrentLocation ? "#EC4899" : "#9CA3AF"}
              />
              {loadingLocation && (
                <ActivityIndicator
                  style={styles.loadingIndicator}
                  color="#EC4899"
                  size="small"
                />
              )}
            </View>
          </View>
        </View>

        <View style={styles.orContainer}>
        <View style={styles.orLine} />
        <View style={styles.orBadge}>
          <Text style={styles.orText}>HOẶC</Text>
        </View>
        <View style={styles.orLine} />
      </View>

        <CenterPicker
          central={central}
          selectedCenter={selectedCenter}
          useCurrentLocation={useCurrentLocation}
          onCenterChange={handleCenterChange}
          onClearSelection={handleAllowClear}
        />
      </View>

      {/* Role Selection Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="people" size={24} color="#EC4899" />
          <Text style={styles.cardTitle}>Vai trò</Text>
        </View>

        <View style={styles.roleContainer}>
          {roleOptions.map((role) => (
            <TouchableOpacity
              key={role.key}
              style={[
                styles.roleOption,
                selectedTypes.includes(role.key) && styles.roleOptionSelected,
              ]}
              onPress={() => {
                if (selectedTypes.includes(role.key)) {
                  onTypeChange(
                    selectedTypes.filter((type) => type !== role.key)
                  );
                } else {
                  onTypeChange([...selectedTypes, role.key]);
                }
              }}
            >
              <View
                style={[
                  styles.roleIcon,
                  { backgroundColor: role.color + "20" },
                ]}
              >
                <Ionicons
                  name={role.icon as any}
                  size={20}
                  color={role.color}
                />
              </View>
              <Text
                style={[
                  styles.roleLabel,
                  selectedTypes.includes(role.key) && styles.roleLabelSelected,
                ]}
              >
                {role.label}
              </Text>
              <Ionicons
                name={
                  selectedTypes.includes(role.key)
                    ? "checkmark-circle"
                    : "ellipse-outline"
                }
                size={24}
                color={selectedTypes.includes(role.key) ? "#EC4899" : "#D1D5DB"}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Distance Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="radio-button-on" size={24} color="#EC4899" />
          <Text style={styles.cardTitle}>Khoảng cách</Text>
        </View>

        <View style={styles.distanceContainer}>
          <Text style={styles.distanceLabel}>
            Bán kính tìm kiếm:{" "}
            <Text style={styles.distanceValue}>{distanceKm} km</Text>
          </Text>

          <View style={styles.sliderContainer}>
            <Slider
              minimumValue={1}
              maximumValue={20}
              step={1}
              value={distanceKm}
              onValueChange={onDistanceChange}
              style={styles.slider}
              minimumTrackTintColor="#EC4899"
              maximumTrackTintColor="#E5E7EB"
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabelText}>1 km</Text>
              <Text style={styles.sliderLabelText}>20 km</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Status Card */}
      <View style={styles.statusCard}>
        <View style={styles.statusIcon}>
          <Ionicons
            name={
              useCurrentLocation
                ? "location"
                : selectedCenter
                ? "business"
                : "home"
            }
            size={20}
            color="#EC4899"
          />
        </View>
        <Text style={styles.statusText}>
          {useCurrentLocation
            ? "Đang tìm kiếm dựa trên vị trí hiện tại"
            : selectedCenter
            ? "Đang tìm kiếm dựa trên vị trí trung tâm"
            : "Đang tìm kiếm dựa trên địa chỉ đã đăng ký"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#E91E63",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    marginTop: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  card: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 12,
  },
  switchContainer: {
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  switchInfo: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
  switchWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingIndicator: {
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },
  pickerContainer: {
    marginTop: 8,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 12,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
  },
  picker: {
    height: 50,
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  orBadge: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginHorizontal: 12,
  },
  orText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    letterSpacing: 0.5,
  },
  clearButton: {
    marginTop: 12,
    alignSelf: "flex-start",
  },
  clearButtonText: {
    color: "#EC4899",
    fontSize: 14,
    fontWeight: "500",
  },
  roleContainer: {
    gap: 12,
  },
  roleOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FAFAFA",
  },
  roleOptionSelected: {
    borderColor: "#EC4899",
    backgroundColor: "#FEF7FF",
  },
  roleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  roleLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  roleLabelSelected: {
    color: "#EC4899",
  },
  distanceContainer: {
    marginTop: 8,
  },
  distanceLabel: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 16,
    textAlign: "center",
  },
  distanceValue: {
    fontWeight: "bold",
    color: "#EC4899",
  },
  sliderContainer: {
    paddingHorizontal: 8,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderThumb: {
    backgroundColor: "#EC4899",
    width: 20,
    height: 20,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  sliderLabelText: {
    fontSize: 12,
    color: "#6B7280",
  },
  statusCard: {
    backgroundColor: "#FEF7FF",
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F3E8FF",
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  statusText: {
    flex: 1,
    fontSize: 14,
    color: "#7C3AED",
    fontWeight: "500",
  },
});
