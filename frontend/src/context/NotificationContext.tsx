"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, CheckCircle, XCircle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'info' | 'auction';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  notify: (title: string, message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = (title: string, message: string, type: NotificationType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, title, message, type }]);

    // Auto dismiss
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 w-80 pointer-events-none">
        <AnimatePresence>
          {notifications.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className="pointer-events-auto glass-panel p-4 shadow-xl flex items-start"
            >
              <div className="flex-shrink-0 mr-3 mt-0.5">
                {n.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                {n.type === 'error' && <XCircle className="w-5 h-5 text-red-400" />}
                {n.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
                {n.type === 'auction' && <Bell className="w-5 h-5 text-pink-400" />}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white">{n.title}</h4>
                <p className="text-xs text-gray-300 mt-1">{n.message}</p>
              </div>
              <button onClick={() => removeNotification(n.id)} className="ml-3 text-gray-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within a NotificationProvider');
  return context;
}
