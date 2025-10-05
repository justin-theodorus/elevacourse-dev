"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import PropTypes from "prop-types"

export function CourseCard({
  title,
  description,
  progress,
  lessonsCompleted,
  totalLessons,
  variant = "default",
}) {
  if (variant === "compact") {
    return (
      <div className="bg-gradient-to-br from-primary to-blue-400 rounded-2xl p-6 text-white min-w-[300px]">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span>Progress: {progress}%</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm opacity-90">
            Lesson Completed: {lessonsCompleted}/{totalLessons}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-primary to-blue-400 rounded-2xl overflow-hidden">
      <div className="flex">
        <div className="w-1/3 bg-primary/80 p-8 flex items-center justify-center">
          <h3 className="text-3xl font-bold text-white">{title}</h3>
        </div>
        <div className="flex-1 p-8 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-semibold mb-3">{title}</h3>
              <p className="text-white/90 leading-relaxed">{description}</p>
            </div>
            <div className="text-right">
              <div className="text-sm mb-1">{progress}/100</div>
              <div className="w-32 bg-white/30 rounded-full h-2">
                <div
                  className="bg-white rounded-full h-2 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-end justify-between mt-8">
            <div className="text-sm">
              <span className="font-medium">
                {lessonsCompleted}/{totalLessons}
              </span>{" "}
              Lesson Completed
            </div>
            <Link href="/lesson">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-2 rounded-full">
                Continue
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

CourseCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired,
  lessonsCompleted: PropTypes.number.isRequired,
  totalLessons: PropTypes.number.isRequired,
  variant: PropTypes.oneOf(["default", "compact"]),
}
