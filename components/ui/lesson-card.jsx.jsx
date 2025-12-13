"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function LessonCard({
  slug,
  title,
  description,
  progress,
  lessonsCompleted,
  totalLessons
}) {
  return (
    <div className="w-full rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
      <div className="flex bg-[#4DA3FF]">
        
        {/* LEFT PANEL */}
        <div
          className="w-56 p-8 flex flex-col justify-between"
          style={{
            background: "linear-gradient(180deg, #4DA3FF 0%, #1A6DFF 100%)"
          }}
        >
          <h2 className="text-white font-semibold text-[22px] leading-tight pr-4">
            {title}
          </h2>

          <p className="mt-6 text-white/90 text-sm">
            <span className="font-semibold">
              {lessonsCompleted}/{totalLessons}
            </span>{" "}
            Lesson Completed
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 p-8 text-white flex flex-col justify-between">
          
          {/* Title + Desc */}
          <div>
            <h2 className="text-white font-semibold text-[24px] mb-3">
              {title}
            </h2>

            <p className="text-white/90 text-[14px] leading-relaxed max-w-[530px]">
              {description}
            </p>
          </div>

          {/* Progress + Button */}
          <div className="flex items-center justify-between mt-8">
            
            {/* Progress Bar */}
            <div className="flex items-center gap-3 flex-1 max-w-[220px]">
              <div className="w-full bg-[#DAE0E7] h-[6px] rounded-full">
                <div
                  className="h-[6px] rounded-full bg-white"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-medium">{progress}/100</span>
            </div>

            {/* Button */}
            <Link href={`/courses/${slug}`}>
              <Button className="bg-white text-blue-600 font-semibold px-8 py-2 rounded-full hover:bg-blue-50 transition">
                Continue
              </Button>
            </Link>
          </div>

        </div>

      </div>
    </div>
  )
}
