import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  X,
  AlertCircle,
  CreditCard,
  Calendar,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "alert" | "payment" | "budget" | "savings";
  date: string;
  read: boolean;
}

interface NotificationCenterProps {
  notifications?: Notification[];
  isOpen?: boolean;
  onClose?: () => void;
}

const defaultNotifications: Notification[] = [
  {
    id: "1",
    title: "Unusual Spending Detected",
    message:
      "We noticed a large transaction of $450 at Electronics Store that is outside your normal spending pattern.",
    type: "alert",
    date: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    title: "Upcoming Bill",
    message:
      "Your monthly rent payment of $1,200 is due in 3 days. Make sure you have sufficient funds.",
    type: "payment",
    date: "1 day ago",
    read: false,
  },
  {
    id: "3",
    title: "Budget Alert",
    message:
      "You've reached 85% of your Dining budget for this month. Consider adjusting your spending.",
    type: "budget",
    date: "2 days ago",
    read: true,
  },
  {
    id: "4",
    title: "Savings Goal Achieved",
    message:
      "Congratulations! You've reached your savings goal of $5,000 for your vacation fund.",
    type: "savings",
    date: "3 days ago",
    read: true,
  },
  {
    id: "5",
    title: "New Account Feature",
    message:
      "We've added a new feature to help you track your recurring subscriptions. Check it out!",
    type: "alert",
    date: "5 days ago",
    read: true,
  },
  {
    id: "6",
    title: "Credit Card Payment",
    message: "Your credit card payment of $350 was successfully processed.",
    type: "payment",
    date: "1 week ago",
    read: true,
  },
];

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications = defaultNotifications,
  isOpen = true,
  onClose = () => {},
}) => {
  const [activeNotifications, setActiveNotifications] =
    useState<Notification[]>(notifications);
  const [filter, setFilter] = useState<string>("all");

  const unreadCount = activeNotifications.filter(
    (notification) => !notification.read,
  ).length;

  const filteredNotifications = activeNotifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    return notification.type === filter;
  });

  const markAsRead = (id: string) => {
    setActiveNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setActiveNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
  };

  const deleteNotification = (id: string) => {
    setActiveNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "payment":
        return <CreditCard className="h-5 w-5 text-blue-500" />;
      case "budget":
        return <TrendingUp className="h-5 w-5 text-red-500" />;
      case "savings":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card className="w-full h-full bg-white shadow-md overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-medium">Notifications</CardTitle>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {unreadCount} new
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mark all notifications as read</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {isOpen && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <div className="px-4 py-2 border-b overflow-x-auto">
        <div className="flex space-x-2">
          <Button
            variant={filter === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("all")}
            className="text-xs"
          >
            All
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("unread")}
            className="text-xs"
          >
            Unread
          </Button>
          <Button
            variant={filter === "alert" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("alert")}
            className="text-xs"
          >
            Alerts
          </Button>
          <Button
            variant={filter === "payment" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("payment")}
            className="text-xs"
          >
            Payments
          </Button>
          <Button
            variant={filter === "budget" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("budget")}
            className="text-xs"
          >
            Budget
          </Button>
          <Button
            variant={filter === "savings" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("savings")}
            className="text-xs"
          >
            Savings
          </Button>
        </div>
      </div>

      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <AnimatePresence>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`p-4 border-b last:border-b-0 ${!notification.read ? "bg-blue-50" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getIconForType(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">
                            {notification.date}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 h-7 text-xs text-blue-600 hover:text-blue-800 p-0"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-[200px] text-center p-4"
              >
                <Bell className="h-10 w-10 text-gray-300 mb-2" />
                <p className="text-gray-500">No notifications to display</p>
                <p className="text-sm text-gray-400 mt-1">
                  {filter !== "all"
                    ? "Try changing your filter"
                    : "You're all caught up!"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
