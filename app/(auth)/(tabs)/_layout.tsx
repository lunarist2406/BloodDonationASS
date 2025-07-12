import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Ionicons } from "@expo/vector-icons";
import { NotificationProvider } from "@/hooks/notification/NotificationContext";
import { LocationPermissionProvider } from "@/hooks/location/locationPermissionContext";

export default function TabLayout() {
  const redColor = "#8B0000"; // đỏ đậm

  return (
    <LocationPermissionProvider>
    <NotificationProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: redColor,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              position: "absolute",
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: () => (
              <Ionicons name="home" size={28} color={redColor} />
            ),
          }}
        />
        <Tabs.Screen
          name="donation"
          options={{
            title: "Hiến máu",
            tabBarIcon: () => (
              <Ionicons name="water" size={28} color={redColor} />
            ),
          }}
        />
        <Tabs.Screen
          name="receiver"
          options={{
            title: "Nhận máu",
            tabBarIcon: () => (
              <Ionicons name="bandage" size={28} color={redColor} />
            ),
          }}
        />
        {/* Đưa AI lên trước tìm kiếm */}
        <Tabs.Screen
          name="chatbot"
          options={{
            title: "AI",
            tabBarIcon: () => (
              <Ionicons name="chatbubbles" size={28} color={redColor} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Tìm kiếm",
            tabBarIcon: () => (
              <Ionicons name="search" size={28} color={redColor} />
            ),
          }}
        />
        <Tabs.Screen
          name="setting"
          options={{
            title: "Cài đặt",
            tabBarIcon: () => (
              <Ionicons name="settings-outline" size={24} color={redColor} />
            ),
          }}
        />
      </Tabs>
    </NotificationProvider>
    </LocationPermissionProvider>
  );
}
