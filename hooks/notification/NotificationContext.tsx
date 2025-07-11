import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import useNotificationService from "./useNotificationService";
import { useAuth } from "../auth/useAuthContext";
import { Notification } from "./useNotification";
import { io, Socket } from "socket.io-client";

interface NotificationContextType {
  unreadCount: number;
  notifications: Notification[];
  setUnreadCount: (count: number) => void;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const NotificationContext = createContext<NotificationContextType>({
  unreadCount: 0,
  notifications: [],
  setUnreadCount: () => {},
  setNotifications: () => {},
});

export const NotificationProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { getAllNotificationsByUser } = useNotificationService();
  const socketRef = useRef<Socket | null>(null);
  const socketURL = `${process.env.EXPO_PUBLIC_API_URL_M}/noti`;

  const fetchNotification = async () => {
    if (!user?.user_id) return;

    const response = await getAllNotificationsByUser();
    const list = (response?.data?.result || []).reverse();
    setNotifications(list);

    const unread = list.filter((n: Notification) => !n.is_read).length;
    setUnreadCount(unread);
  };

  useEffect(() => {
    if (!user?.user_id) return;

    fetchNotification();

    // ⚡ Connect socket
    const socket = io(socketURL, {
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.emit("register", { user_id: user.user_id });

    socket.on("userReceive", (payload: any) => {
      const newNotification: Notification = {
        notification_id: payload.notification_id,
        message: payload.message,
        type: payload.type,
        is_read: false,
        created_at: new Date(payload.created_at),
      };

      setNotifications((prev) => {
        const updated = [newNotification, ...prev];
        setUnreadCount(updated.filter((n) => !n.is_read).length);
        return updated;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.user_id]);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        setUnreadCount,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => useContext(NotificationContext);
