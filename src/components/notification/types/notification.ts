type NotificationTypeString = 
  | 'SYSTEM'
  | 'BOOKING_DONATE_SUCCESS'
  | 'BOOKING_RECEIVE_SUCCESS'
  | 'CANCELLED_DONATE_SCHEDULE'
  | 'CANCELLED_RECEIVE_SCHEDULE'
  | 'REMINDER';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationTypeString;
  isRead: boolean;
  createdAt: Date;
}

export interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}