import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { Bell, CheckCircle, AlertCircle, Check, Circle } from "lucide-react";
import { useParams } from "react-router";
import type { BackendNotification } from "../services/workflowApi";
import { workflowApi } from "../services/workflowApi";

const formatRelative = (timestamp: string) => {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = Math.max(0, now - then);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return "just now";
  if (diffMs < hour) return `${Math.floor(diffMs / minute)} minutes ago`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)} hours ago`;
  return `${Math.floor(diffMs / day)} days ago`;
};

const inferStyle = (message: string) => {
  const lower = message.toLowerCase();
  if (lower.includes("failed") || lower.includes("eds") || lower.includes("required")) {
    return { color: "red", icon: AlertCircle };
  }
  if (lower.includes("success") || lower.includes("submitted") || lower.includes("finalized")) {
    return { color: "green", icon: CheckCircle };
  }
  return { color: "blue", icon: Bell };
};

export function NotificationsPage() {
  const { role } = useParams();
  const roleKey = role || "proponent";
  const [notifications, setNotifications] = useState<BackendNotification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    try {
      setError("");
      setIsLoading(true);
      const data = await workflowApi.listNotifications();
      setNotifications(data.items);
    } catch (loadError: any) {
      setError(loadError?.response?.data?.message || "Unable to load notifications.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadNotifications();
  }, []);

  const unreadCount = notifications.filter((notification) => !notification.is_read).length;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      if (filter === "unread") return !notification.is_read;
      if (filter === "read") return notification.is_read;
      return true;
    });
  }, [filter, notifications]);

  const markAsRead = async (id: number) => {
    try {
      await workflowApi.markNotificationRead(id);
      setNotifications((current) => current.map((notification) => (notification.id === id ? { ...notification, is_read: true } : notification)));
    } catch (markError: any) {
      setError(markError?.response?.data?.message || "Unable to mark notification as read.");
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter((notification) => !notification.is_read).map((notification) => notification.id);
    if (!unreadIds.length) {
      return;
    }

    try {
      await Promise.all(unreadIds.map((id) => workflowApi.markNotificationRead(id)));
      setNotifications((current) => current.map((notification) => ({ ...notification, is_read: true })));
    } catch (markError: any) {
      setError(markError?.response?.data?.message || "Unable to mark all notifications as read.");
    }
  };

  return (
    <DashboardLayout role={roleKey}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
              <p className="text-gray-600">Live workflow updates generated from payment, submission, scrutiny, and MoM events</p>
            </div>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={() => void markAllAsRead()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Mark All as Read
              </button>
            ) : null}
          </div>
        </div>

        {error ? <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Bell className="w-8 h-8 opacity-90" />
              <span className="text-3xl font-bold">{notifications.length}</span>
            </div>
            <p className="text-sm opacity-90">Total Notifications</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Circle className="w-8 h-8 opacity-90 fill-current" />
              <span className="text-3xl font-bold">{unreadCount}</span>
            </div>
            <p className="text-sm opacity-90">Unread</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 opacity-90" />
              <span className="text-3xl font-bold">{notifications.length - unreadCount}</span>
            </div>
            <p className="text-sm opacity-90">Read</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === "unread" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Unread ({unreadCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter("read")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === "read" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Read ({notifications.length - unreadCount})
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">Loading notifications...</div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No notifications found</p>
              <p className="text-sm text-gray-400 mt-1">{filter === "unread" ? "All caught up. No unread notifications." : "Try adjusting your filter."}</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const style = inferStyle(notification.message);
              const Icon = style.icon;
              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl shadow-sm border-2 transition-all ${notification.is_read ? "border-gray-200 opacity-75" : "border-blue-300 shadow-md"}`}
                >
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                          style.color === "green"
                            ? "bg-green-100"
                            : style.color === "red"
                              ? "bg-red-100"
                              : "bg-blue-100"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${
                            style.color === "green"
                              ? "text-green-600"
                              : style.color === "red"
                                ? "text-red-600"
                                : "text-blue-600"
                          }`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2 gap-4">
                          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            Workflow Update
                            {!notification.is_read ? <span className="w-2 h-2 bg-blue-600 rounded-full" /> : null}
                          </h3>
                          <span className="text-sm text-gray-500 whitespace-nowrap">{formatRelative(notification.created_at)}</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">{notification.message}</p>

                        {!notification.is_read ? (
                          <button
                            type="button"
                            onClick={() => void markAsRead(notification.id)}
                            className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center gap-1"
                          >
                            <Check className="w-4 h-4" />
                            Mark as Read
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}