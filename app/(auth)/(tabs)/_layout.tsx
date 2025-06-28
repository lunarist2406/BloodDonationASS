import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const redColor = '#8B0000'; // đỏ đậm

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: redColor, // Nếu bạn muốn tab active cũng đỏ luôn
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: () => <Ionicons name="home" size={28} color={redColor} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: () => <Ionicons name="paper-plane" size={28} color={redColor} />,
        }}
      />
      <Tabs.Screen
        name="donation"
        options={{
          title: 'Hiến máu',
          tabBarIcon: () => <Ionicons name="water" size={28} color={redColor} />,
        }}
      />
      <Tabs.Screen
        name="receiver"
        options={{
          title: 'Nhận máu',
          tabBarIcon: () => <Ionicons name="bandage" size={28} color={redColor} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Tìm kiếm',
          tabBarIcon: () => <Ionicons name="search" size={28} color={redColor} />,
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: 'Cài đặt',
          tabBarIcon: () => <Ionicons name="settings-outline" size={24} color={redColor} />,
        }}
      />
    </Tabs>
  );
}
