import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconBell } from '@tabler/icons-react';
import { io, Socket } from 'socket.io-client';
import type { Notification, NotificationDropdownProps } from './types/notification';
import { api } from '../config/axios/axiosInstance';

const SOCKET_URL = "http://localhost:3000/noti"; // Đổi thành URL backend của bạn

export const NotificationDropdown: React.FC<NotificationDropdownProps & { userId: string }> = ({
  notifications: propNotifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const userStr = localStorage.getItem('user'); // Đúng key bạn lưu
  const user = userStr ? JSON.parse(userStr) : null;
  const userId = user?.user_id;
  console.log('userId:', userId);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // Lấy danh sách thông báo khi mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/api/v1/notifications', {
          params: { current: 1, pageSize: 20, qs: '' },
        });
        // Map dữ liệu từ BE sang FE
        setNotifications(
          res.data.result.map((n: any) => ({
            id: n.notification_id,
            message: n.message,
            type: n.type,
            isRead: n.is_read,
            createdAt: new Date(n.created_at),
          }))
        );
      } catch (err) {
        // Xử lý lỗi nếu cần
      }
    };
    fetchNotifications();
  }, []);

  // Kết nối socket và lắng nghe thông báo mới
  useEffect(() => {
    console.log('userId:', userId);
    if (!userId) return;
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.emit('register', { user_id: userId });

    socket.on('userReceive', (payload: any) => {
      // Thêm thông báo mới vào đầu danh sách
      setNotifications(prev => [
        {
          id: payload.notification_id,
          message: payload.message,
          type: payload.type,
          isRead: false,
          createdAt: new Date(payload.created_at),
        },
        ...prev,
      ]);
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);

  // Đánh dấu đã đọc 1 thông báo
  const handleMarkAsRead = (id: string) => {
  setNotifications(prev =>
    prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
  );
  if (onMarkAsRead) onMarkAsRead(id);
};

  // Đánh dấu tất cả đã đọc
  const handleMarkAllAsRead = () => {
  setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  if (onMarkAllAsRead) onMarkAllAsRead();
};

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  const formatNotificationTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    return `${Math.floor(hours / 24)} ngày trước`;
  };

  return (
    <div ref={notificationRef} className="relative">
      <button
        onClick={e => {
          e.stopPropagation();
          setShowNotifications((prev) => !prev);
        }}
        className="relative p-2 hover:bg-red-700 rounded-full transition-colors duration-200"
      >
        <IconBell size={24} className="text-white cursor-pointer" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute right-0 mt-2 w-96 rounded-xl shadow-2xl bg-white border border-gray-200 z-50"
          >
            <div className="flex justify-between items-center px-5 py-3 border-b bg-gray-50 rounded-t-xl">
              <h3 className="font-semibold text-gray-700 text-lg">Thông báo</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-red-600 hover:text-red-800 font-medium cursor-pointer"
                >
                  Đánh dấu tất cả đã đọc
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Không có thông báo mới
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 px-5 py-4 transition-colors duration-200 cursor-pointer
                      ${!notification.isRead
                        ? 'bg-red-50 border-l-4 border-red-400'
                        : 'bg-white'}
                      hover:bg-gray-100
                    `}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <span className={`mt-1 w-3 h-3 rounded-full ${getNotificationColor(notification.type)}`} />
                    <div>
                      <p className="text-sm text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatNotificationTime(notification.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;