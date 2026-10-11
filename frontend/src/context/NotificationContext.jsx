import React, { createContext, useContext, useState, useEffect } from 'react';
import { notificationAPI } from '../api/client';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

const LOCAL_STORAGE_READ_KEY = 'agrismart_read_notifications';

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Helper to load locally acknowledged IDs
  const getLocalReadIds = () => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_READ_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const isItemRead = (item) => {
    if (!item) return true;
    const localReadIds = getLocalReadIds();
    if (localReadIds.includes(item._id)) return true;
    if (user?._id && item.readBy?.includes(user._id)) return true;
    return false;
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await notificationAPI.getNotifications();
      if (res.data.success) {
        const fetched = res.data.notifications || [];
        setNotifications(fetched);
        
        // Count unread by checking both MongoDB readBy and local storage
        const localReadIds = getLocalReadIds();
        const unread = fetched.filter((n) => {
          if (localReadIds.includes(n._id)) return false;
          if (user?._id && n.readBy?.includes(user._id)) return false;
          return true;
        }).length;

        setUnreadCount(unread);
      }
    } catch (err) {
      console.warn('Failed to load notifications:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const markRead = async (id) => {
    // 1. Instantly persist to local storage
    const currentLocal = getLocalReadIds();
    if (!currentLocal.includes(id)) {
      const updated = [...currentLocal, id];
      localStorage.setItem(LOCAL_STORAGE_READ_KEY, JSON.stringify(updated));
    }

    // 2. Instantly update state in memory
    setNotifications((prev) =>
      prev.map((n) =>
        n._id === id
          ? { ...n, readBy: [...(n.readBy || []), user?._id || 'guest'] }
          : n
      )
    );
    setUnreadCount((c) => Math.max(0, c - 1));

    // 3. Sync with backend API
    try {
      await notificationAPI.markRead(id);
    } catch (err) {
      // Non-blocking
    }
  };

  const markAllRead = async () => {
    // 1. Instantly save all notification IDs to local storage
    const allIds = notifications.map((n) => n._id);
    const currentLocal = getLocalReadIds();
    const merged = Array.from(new Set([...currentLocal, ...allIds]));
    localStorage.setItem(LOCAL_STORAGE_READ_KEY, JSON.stringify(merged));

    // 2. Instantly update local state
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        readBy: [...(n.readBy || []), user?._id || 'guest'],
      }))
    );
    setUnreadCount(0);

    // 3. Sync with backend API
    try {
      await notificationAPI.markAllRead();
    } catch (err) {
      // Non-blocking
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markRead,
        markAllRead,
        isItemRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
