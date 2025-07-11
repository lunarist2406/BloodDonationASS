import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { formatDistanceToNowStrict } from "date-fns";
import { vi } from "date-fns/locale";
import { Notification, getIconColor, getNotificationIcon } from "@/hooks/notification/useNotification";
import useNotificationService from "@/hooks/notification/useNotificationService";
import { useNotificationContext } from "@/hooks/notification/NotificationContext";

export default function NotificationsScreen({ onClose }: { onClose: () => void }) {
  const { notifications, setNotifications, unreadCount, setUnreadCount } = useNotificationContext();
  const { markReadNotification, markReadAllNotification } = useNotificationService();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const tick = () => setNow(new Date());
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, []);

  const getTimeText = (rawDate: Date | string, now: Date): string => {
    const date = new Date(rawDate);
    if (isNaN(date.getTime())) return "Không rõ thời gian";

    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffSec < 60) return "Vài giây trước";

    return formatDistanceToNowStrict(date, { locale: vi, addSuffix: true });
  };

  const handleMarkAsRead = async (id: string) => {
    await markReadNotification(id);
    const updated = notifications.map((n) =>
      n.notification_id === id ? { ...n, is_read: true } : n
    );
    setNotifications(updated);
    setUnreadCount(updated.filter((n) => !n.is_read).length);
  };

  const handleMarkAllAsRead = async () => {
    await markReadAllNotification();
    const updated = notifications.map((n) => ({ ...n, is_read: true }));
    setNotifications(updated);
    setUnreadCount(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.customHeader}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => {
              onClose();
            }}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Thông báo</Text>
            {notifications.some((n) => !n.is_read) && (
              <Text style={styles.unreadTextCount}>
                {unreadCount} thông báo chưa đọc
              </Text>
            )}
          </View>
        </View>

        <View style={styles.bellContainer}>
          <Ionicons name="notifications-outline" size={24} color="white" />
          {notifications.some((n) => !n.is_read) && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </View>

      {notifications.some((n) => !n.is_read) && (
        <TouchableOpacity style={styles.markAll} onPress={handleMarkAllAsRead}>
          <Ionicons name="checkmark-done" size={16} color="#ec4899" />
          <Text style={styles.markAllText}>Đánh dấu tất cả đã đọc</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.notification_id}
        extraData={now}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, !item.is_read && styles.unread]}
            onPress={() => handleMarkAsRead(item.notification_id)}
          >
            <Ionicons
              name={getNotificationIcon(item.type)}
              size={24}
              color={getIconColor(item.type)}
              style={{ marginTop: 5 }}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text
                style={[styles.message, !item.is_read && styles.unreadText]}
              >
                {item.message}
              </Text>
              <Text style={styles.time}>
                {getTimeText(item.created_at, now)}
              </Text>
            </View>
            {item.is_read && (
              <Ionicons
                name="checkmark"
                size={16}
                color="gray"
                style={{ marginTop: 5 }}
              />
            )}
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#ec4899",
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  customHeader: {
    backgroundColor: "#ec4899",
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12, // bạn có thể dùng marginRight nếu RN cũ không hỗ trợ gap
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  unreadTextCount: {
    color: "#fff",
    fontSize: 13,
    opacity: 0.9,
  },
  bellContainer: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#dc2626", // red-600
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  markAll: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
  },
  markAllText: {
    marginLeft: 6,
    color: "#ec4899",
    fontSize: 14,
    fontWeight: "500",
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "white",
  },
  unread: {
    backgroundColor: "#fef3f2", // rose-50
  },
  message: {
    fontSize: 14,
    color: "#1f2937",
  },
  unreadText: {
    fontWeight: "600",
  },
  time: {
    marginTop: 4,
    fontSize: 12,
    color: "gray",
  },
});
