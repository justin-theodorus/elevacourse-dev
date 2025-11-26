"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * @typedef {Object} CalendarWidgetProps
 * @property {number} [month=0] - Month (0-11)
 * @property {number} [year=2025] - Year
 */

export default function CalendarWidget({ month, year }) {
  const initialDate = new Date()

  const [currentDate, setCurrentDate] = useState(
    month !== undefined && year !== undefined
      ? new Date(year, month, 1)
      : initialDate
  )

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const firstDay = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const days = []
  const startDate = firstDay(currentDate)
  const maxDays = daysInMonth(currentDate)

  for (let i = 0; i < startDate; i++) {
    days.push(null)
  }

  for (let i = 1; i <= maxDays; i++) {
    days.push(i)
  }

  const today = new Date().getDate()
  const isCurrentMonth = new Date().getMonth() === currentDate.getMonth()

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-foreground">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={previousMonth} className="h-8 w-8 p-0">
            <ChevronLeft size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={nextMonth} className="h-8 w-8 p-0">
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-muted-foreground h-8 flex items-center justify-center"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <div
            key={index}
            className={`
              h-8 flex items-center justify-center rounded text-sm font-medium
              ${day === null ? "" : ""}
              ${
                day === today && isCurrentMonth
                  ? "bg-blue-500 text-white rounded-full"
                  : "text-foreground hover:bg-muted"
              }
            `}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  )
}
