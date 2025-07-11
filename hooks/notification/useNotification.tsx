import { useEffect, useState } from "react";
import useNotificationService from "./useNotificationService";
import { Ionicons } from "@expo/vector-icons";

export const getIconColor = (type: NotificationType) => {
  switch (type) {
    case NotificationType.BOOKING_DONATE_SUCCESS:
      return "#10b981";
    case NotificationType.BOOKING_RECEIVE_SUCCESS:
      return "#0ea5e9";
    case NotificationType.REMINDER:
      return "#f59e0b";
    case NotificationType.CANCELLED_DONATE_SCHEDULE:
    case NotificationType.CANCELLED_RECEIVE_SCHEDULE:
      return "#ef4444";
    case NotificationType.SYSTEM:
    default:
      return "#6366f1";
  }
};

export const getNotificationIcon = (
  type: NotificationType
): keyof typeof Ionicons.glyphMap => {
  switch (type) {
    case NotificationType.BOOKING_DONATE_SUCCESS:
      return "heart-circle-outline";
    case NotificationType.BOOKING_RECEIVE_SUCCESS:
      return "medkit-outline";
    case NotificationType.REMINDER:
      return "alarm-outline";
    case NotificationType.CANCELLED_DONATE_SCHEDULE:
    case NotificationType.CANCELLED_RECEIVE_SCHEDULE:
      return "close-circle-outline";
    case NotificationType.SYSTEM:
    default:
      return "notifications-outline";
  }
};

export enum NotificationType {
  SYSTEM = "SYSTEM",

  REMINDER = "REMINDER",
  BOOKING_DONATE_SUCCESS = "BOOKING_DONATE_SUCCESS",
  BOOKING_RECEIVE_SUCCESS = "BOOKING_RECEIVE_SUCCESS",
  CANCELLED_DONATE_SCHEDULE = "CANCELLED_DONATE_SCHEDULE",
  CANCELLED_RECEIVE_SCHEDULE = "CANCELLED_RECEIVE_SCHEDULE",
}

export interface Notification {
  notification_id: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  created_at: Date;
}

export interface NotificationApiResponse {
  result: Notification[];
  total: number;
  current: number;
  pageSize: number;
}

export default function useNotification() {
  const [Notification, setNotification] = useState<Notification[]>([]);
  const { getAllNotificationsByUser } = useNotificationService();

  const fetchNotification = async () => {
    const response = await getAllNotificationsByUser() as {
      data: NotificationApiResponse;
    };
    const notiList = (response.data.result || []).reverse();
    setNotification(notiList);
    return notiList;
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  return { Notification, setNotification, fetchNotification };
}
