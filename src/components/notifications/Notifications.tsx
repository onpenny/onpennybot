"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X } from "lucide-react";

type Notification = {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  autoClose?: boolean;
};

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // 监听通知事件
    const handleNotification = (event: CustomEvent<Notification>) => {
      const notification = event.detail;
      setNotifications((prev) => [notification, ...prev]);

      // 自动关闭
      if (notification.autoClose !== false) {
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
        }, 5000);
      }
    };

    window.addEventListener("notification", handleNotification as EventListener);

    return () => {
      window.removeEventListener("notification", handleNotification as EventListener);
    };
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getNotificationStyles = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-emerald-50 border-emerald-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-amber-50 border-amber-200";
      case "info":
        return "bg-blue-50 border-blue-200";
    }
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 pointer-events-none">
      {notifications.map((notification) => (
        <Alert
          key={notification.id}
          className={`pointer-events-auto shadow-xl border-2 ${getNotificationStyles(notification.type)}`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
            <div className="flex-1">
              <div className="font-bold text-lg mb-1">{notification.title}</div>
              <AlertDescription className="text-base">
                {notification.message}
              </AlertDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeNotification(notification.id)}
              className="h-8 w-8 p-0 hover:bg-black/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Alert>
      ))}
    </div>
  );
}

export function useNotifications() {
  const showNotification = (notification: Omit<Notification, "id">) => {
    const id = nanoid();
    const notificationWithId = { ...notification, id } as Notification;

    const event = new CustomEvent("notification", {
      detail: notificationWithId,
    });

    window.dispatchEvent(event);
  };

  return { showNotification };
}

function nanoid() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

type EventListener = (event: Event) => void;
