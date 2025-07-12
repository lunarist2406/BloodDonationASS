import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Switch,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useAuth } from "@/hooks/auth/useAuthContext";
import { useHealth } from "@/hooks/HealthInfor/useUser";
import { ToastAndroid } from "react-native";
import * as Location from "expo-location";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useLocationCache } from "@/hooks/location/useCurrentLocation";
import { useLocationPermission } from "@/hooks/location/locationPermissionContext";

export default function SettingScreen() {
  const { logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const { setLocationCache, getLocationCache } = useLocationCache();
  const [locationEnabled, setLocationEnabled] = React.useState(false);
  const { locationAllowed, setLocationAllowed } = useLocationPermission();
  const [loadingLocation, setLoadingLocation] = React.useState(false);
  const { userHealth } = useHealth();
  console.log("User Health:", userHealth);
  const handleLogoutConfirmed = async () => {
    await logout();
    console.log("Logged out");
    router.push("/(auth)/login");
  };

  const handleCheckLocation = async () => {
  setLoadingLocation(true);

  const { status } = await Location.getForegroundPermissionsAsync();

  if (status !== "granted") {
    const request = await Location.requestForegroundPermissionsAsync();
    if (request.status !== "granted") {
      ToastAndroid.show("Bạn đã từ chối truy cập vị trí.", ToastAndroid.SHORT);
      setLoadingLocation(false);
      setLocationAllowed(false);
      return;
    }
  }

  setLocationAllowed(true);
  setLocationEnabled(true);
  setLoadingLocation(false);
};

useFocusEffect(
  useCallback(() => {
    const syncLocationPermission = async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      setLocationEnabled(status === "granted" && locationAllowed);
    };

    syncLocationPermission();
  }, [locationAllowed])
);

  const handleLogout = () => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn đăng xuất không?", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: handleLogoutConfirmed,
      },
    ]);
  };

  const settingSections = [
    {
      title: "Tài khoản",
      items: [
        {
          icon: "person-outline",
          label: "Thông tin cá nhân",
          subtitle: "Cập nhật thông tin của bạn",
          onPress: () => console.log("Profile"),
        },
        {
          icon: "shield-checkmark-outline",
          label: "Bảo mật",
          subtitle: "Mật khẩu và xác thực",
          onPress: () => console.log("Security"),
        },
        {
          icon: "card-outline",
          label: "Phương thức thanh toán",
          subtitle: "Quản lý thẻ và ví điện tử",
          onPress: () => console.log("Payment"),
        },
      ],
    },
    {
      title: "Hoạt động",
      items: [
        {
          icon: "time-outline",
          label: "Lịch sử hiến máu",
          subtitle: "Xem lịch sử hiến máu của bạn",
          onPress: () => console.log("Donation History"),
        },
        {
          icon: "medical-outline",
          label: "Lịch sử nhận máu",
          subtitle: "Xem lịch sử nhận máu",
          onPress: () => console.log("Receive History"),
        },
        {
          icon: "heart-outline",
          label: "Thông tin sức khỏe",
          subtitle: "Cập nhật tình trạng sức khỏe",
          onPress: () => console.log("Health Info"),
        },
      ],
    },
    {
      title: "Cài đặt ứng dụng",
      items: [
        {
          icon: "notifications-outline",
          label: "Thông báo",
          subtitle: "Quản lý thông báo push",
          isSwitch: true,
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          icon: "location-outline",
          label: "Vị trí",
          subtitle: "Cho phép truy cập vị trí",
          isSwitch: true,
          value: locationEnabled,
          onToggle: () => {
            if (!locationEnabled) {
              handleCheckLocation();
            } else {
              setLocationEnabled(false);
              setLocationAllowed(false);
            }
          },
          renderExtra: () =>
            loadingLocation ? (
              <ActivityIndicator
                style={{ marginLeft: 12 }}
                size="small"
                color="#E91E63"
              />
            ) : null,
        },
        {
          icon: "language-outline",
          label: "Ngôn ngữ",
          subtitle: "Tiếng Việt",
          onPress: () => console.log("Language"),
        },
        {
          icon: "moon-outline",
          label: "Giao diện tối",
          subtitle: "Chế độ ban đêm",
          onPress: () => console.log("Dark Mode"),
        },
      ],
    },
    {
      title: "Hỗ trợ",
      items: [
        {
          icon: "help-circle-outline",
          label: "Trung tâm trợ giúp",
          subtitle: "FAQ và hướng dẫn",
          onPress: () => console.log("Help"),
        },
        {
          icon: "chatbubble-outline",
          label: "Liên hệ hỗ trợ",
          subtitle: "Chat với đội ngũ hỗ trợ",
          onPress: () => console.log("Contact"),
        },
        {
          icon: "star-outline",
          label: "Đánh giá ứng dụng",
          subtitle: "Để lại đánh giá trên store",
          onPress: () => console.log("Rate App"),
        },
        {
          icon: "document-text-outline",
          label: "Điều khoản sử dụng",
          subtitle: "Chính sách và điều khoản",
          onPress: () => console.log("Terms"),
        },
      ],
    },
  ];

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cài đặt</Text>
          <View style={styles.placeholder} />
        </View>

        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
            }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Ayushman Kumar</Text>
            <Text style={styles.profileEmail}>ayushman@example.com</Text>
            <View style={styles.bloodTypeContainer}>
              <Text style={styles.bloodTypeText}>A+</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editProfileButton}>
            <Ionicons name="create-outline" size={20} color="#E91E63" />
          </TouchableOpacity>
        </View>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.settingItem,
                    itemIndex === section.items.length - 1 && styles.lastItem,
                  ]}
                  onPress={item.onPress}
                  disabled={item.isSwitch}
                >
                  <View style={styles.settingIcon}>
                    <Ionicons name={item.icon} size={22} color="#E91E63" />
                  </View>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                    <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Switch
                      value={item.value}
                      disabled={item.label === "Vị trí" && loadingLocation}
                      onValueChange={item.onToggle}
                      trackColor={{ false: "#e0e0e0", true: "#E91E63" }}
                      thumbColor={item.value ? "#fff" : "#f4f3f4"}
                    />
                    {item.label === "Vị trí" && loadingLocation && (
                      <ActivityIndicator
                        size="small"
                        color="#E91E63"
                        style={{ marginLeft: 8 }}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={styles.logoutIcon}>
            <Ionicons name="log-out-outline" size={22} color="#fff" />
          </View>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
          <Text style={styles.versionSubtext}>Lunarist Blood Donation</Text>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  placeholder: {
    width: 40,
  },
  profileCard: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  bloodTypeContainer: {
    backgroundColor: "#E91E63",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  bloodTypeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  editProfileButton: {
    backgroundColor: "#fce4ec",
    borderRadius: 20,
    padding: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 20,
    marginBottom: 10,
  },
  sectionCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingIcon: {
    backgroundColor: "#fce4ec",
    borderRadius: 10,
    padding: 8,
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: "#666",
  },
  logoutButton: {
    backgroundColor: "#E91E63",
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#E91E63",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  versionContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  versionText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  versionSubtext: {
    fontSize: 12,
    color: "#999",
  },
  bottomSpacing: {
    height: 20,
  },
});
