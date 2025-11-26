"use client"

import { Trash2, Lock, BookOpen, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * @typedef {Object} Notification
 * @property {string} id
 * @property {string} type - 'password' | 'delete' | 'course' | 'lesson'
 * @property {string} title
 * @property {string} description
 * @property {string} time
 * @property {React.ReactNode} icon
 * @property {string} bgColor
 */

/**
 * @typedef {Object} NotificationWidgetProps
 * @property {Notification[]} [notifications] - Array of notifications to display
 */

const defaultNotifications = [
  {
    id: "1",
    type: "password",
    title: "New Password",
    description: "Your password has been successfully changed",
    time: "1 day",
    icon: <Lock size={20} />,
    bgColor: "bg-green-500/10",
  },
  {
    id: "2",
    type: "delete",
    title: "Delete Course",
    description: "Data Mining course has been deleted successfully",
    time: "1 day",
    icon: <Trash2 size={20} />,
    bgColor: "bg-red-500/10",
  },
  {
    id: "3",
    type: "course",
    title: "New Course",
    description: "New course Machine Learning has been added successfully",
    time: "1 day",
    icon: <BookOpen size={20} />,
    bgColor: "bg-blue-500/10",
  },
  {
    id: "4",
    type: "lesson",
    title: "New Lesson",
    description: "New lesson has been successfully added",
    time: "1 day",
    icon: <Plus size={20} />,
    bgColor: "bg-purple-500/10",
  },
]

export default function NotificationsWidget({ notifications = defaultNotifications }) {
  const getIconColor = (type) => {
    const colors = {
      password: "text-green-600",
      delete: "text-red-600",
      course: "text-blue-600",
      lesson: "text-purple-600",
    }
    return colors[type] || "text-gray-600"
  }

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h3 className="text-lg font-bold text-foreground mb-4">Notifications</h3>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div key={notification.id} className={`flex items-start gap-3 p-3 rounded-lg ${notification.bgColor} group`}>
            <div className={`flex-shrink-0 ${getIconColor(notification.type)} mt-1`}>{notification.icon}</div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground text-sm">{notification.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2">{notification.description}</p>
              <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
