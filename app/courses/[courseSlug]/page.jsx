"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Maximize2, Minimize2, Check } from "lucide-react"

export default function CourseDetailPage() {
  const { courseSlug } = useParams()
  const [isFullscreen, setIsFullscreen] = useState(false)

  // ✅ Mock data (ganti nanti pakai API)
  const courseMap = {
    "data-mining": {
      title: "Data Mining",
      items: [
        {
          type: "lesson",
          id: "intro",
          title: "Introduction to Data Mining",
          status: "done",
          content: demoContent("Introduction to Data Mining"),
        },
        {
          type: "lesson",
          id: "pengertian",
          title: "Pengertian Data Mining",
          status: "done",
          content: demoContent("Pengertian Data Mining"),
        },
        {
          type: "lesson",
          id: "process",
          title: "Data Mining Process",
          status: "active",
          content: demoContent("Data Mining Process"),
        },

        { type: "section", id: "kdp", title: "Knowledge Discovery Process" },
        {
          type: "lesson",
          id: "tahapan",
          title: "Tahapan Utama",
          status: "locked",
          content: demoContent("Tahapan Utama"),
        },

        { type: "section", id: "apps", title: "Applications" },
        {
          type: "lesson",
          id: "bisnis",
          title: "Bisnis & E-commerce",
          status: "locked",
          content: demoContent("Bisnis & E-commerce"),
        },
        {
          type: "lesson",
          id: "kesehatan",
          title: "Kesehatan & Keuangan",
          status: "locked",
          content: demoContent("Kesehatan & Keuangan"),
        },

        { type: "section", id: "challenges", title: "Challenges" },
        {
          type: "lesson",
          id: "kualitas",
          title: "Kualitas Data",
          status: "locked",
          content: demoContent("Kualitas Data"),
        },
        {
          type: "lesson",
          id: "privasi",
          title: "Privasi & Etika",
          status: "locked",
          content: demoContent("Privasi & Etika"),
        },
      ],
    },

    // contoh biar ga 404
    "machine-learning": {
      title: "Machine Learning",
      items: [
        {
          type: "lesson",
          id: "intro-ml",
          title: "Intro to ML",
          status: "active",
          content: demoContent("Intro to ML"),
        },
        {
          type: "lesson",
          id: "supervised",
          title: "Supervised Learning",
          status: "locked",
          content: demoContent("Supervised Learning"),
        },
      ],
    },
  }

  const course = courseMap[courseSlug]

  if (!course) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50 p-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="font-semibold mb-2">Course not found</p>
          <Link href="/courses" className="text-blue-600 underline">
            Back to Courses
          </Link>
        </div>
      </div>
    )
  }

  // default: ambil lesson active, kalau ga ada ambil lesson pertama
  const defaultLessonId = useMemo(() => {
    const active = course.items.find(
      (x) => x.type === "lesson" && x.status === "active"
    )
    const firstLesson = course.items.find((x) => x.type === "lesson")
    return active?.id || firstLesson?.id
  }, [course.items])

  const [selectedId, setSelectedId] = useState(defaultLessonId)

  const selectedLesson = useMemo(() => {
    return course.items.find((x) => x.type === "lesson" && x.id === selectedId)
  }, [course.items, selectedId])

  // ✅ ESC keluar fullscreen
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") setIsFullscreen(false)
    }
    window.addEventListener("keydown", onEsc)
    return () => window.removeEventListener("keydown", onEsc)
  }, [])

  // ✅ lock body scroll pas fullscreen
  useEffect(() => {
    if (!isFullscreen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [isFullscreen])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div
        className={[
          "mx-auto max-w-7xl flex gap-6",
          isFullscreen ? "hidden" : "",
        ].join(" ")}
      >
        {/* LEFT SIDEBAR */}
        <aside className="w-[340px] shrink-0 rounded-[32px] bg-[#EEF4FF] p-6">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>

          <h2 className="mt-4 text-2xl font-extrabold text-blue-700">
            {course.title}
          </h2>

          {/* TIMELINE */}
          <div className="relative mt-6">
            {/* line */}
            <div className="absolute left-[11px] top-0 bottom-0 w-[2px] bg-blue-200/70 rounded-full" />

            <ul className="space-y-4">
              {course.items.map((item) => {
                if (item.type === "section") {
                  return (
                    <li key={item.id} className="mt-6">
                      <div className="text-[14px] font-extrabold text-blue-700">
                        {item.title}
                      </div>
                    </li>
                  )
                }

                const isActive = item.id === selectedId
                const isDone = item.status === "done"
                const isLocked = item.status === "locked"

                return (
                  <li key={item.id} className="flex gap-4">
                    {/* DOT COLUMN (lurus sama garis) */}
                    <div className="w-6 flex justify-center">
                      <LessonDot status={item.status} active={isActive} />
                    </div>

                    {/* TEXT */}
                    <button
                      type="button"
                      disabled={isLocked}
                      onClick={() => setSelectedId(item.id)}
                      className={[
                        "flex-1 text-left rounded-xl px-3 py-2 transition",
                        isLocked
                          ? "cursor-not-allowed opacity-60"
                          : "hover:bg-white/60",
                        isActive ? "bg-white shadow-sm" : "",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "text-[13px] font-semibold",
                          isActive
                            ? "text-blue-700"
                            : isDone
                            ? "text-blue-600"
                            : "text-gray-700",
                        ].join(" ")}
                      >
                        {item.title}
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </aside>

        {/* RIGHT CONTENT (normal) */}
        <RightContent
          lesson={selectedLesson}
          isFullscreen={false}
          onToggleFullscreen={() => setIsFullscreen(true)}
        />
      </div>

      {/* RIGHT CONTENT (fullscreen overlay) */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-gray-50 p-6">
          <div className="mx-auto max-w-5xl">
            <RightContent
              lesson={selectedLesson}
              isFullscreen={true}
              onToggleFullscreen={() => setIsFullscreen(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function RightContent({ lesson, isFullscreen, onToggleFullscreen }) {
  return (
    <main className="flex-1 rounded-[32px] bg-[#F3F6FF] p-8">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-4xl font-extrabold text-blue-700 leading-tight">
          {lesson?.title || "Select a lesson"}
        </h1>

        <button
          type="button"
          onClick={onToggleFullscreen}
          className="rounded-xl bg-white/80 p-3 hover:bg-white transition shadow-sm"
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? (
            <Minimize2 className="w-5 h-5 text-gray-700" />
          ) : (
            <Maximize2 className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>

      <div className="mt-6 rounded-3xl bg-white p-8 shadow-sm">
        <div className="overflow-hidden rounded-2xl bg-gray-100">
          <img
            src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1200&q=60"
            alt="lesson cover"
            className="w-full h-[240px] object-cover"
          />
        </div>

        <div className="mt-6 text-[14px] leading-relaxed text-gray-700 whitespace-pre-line">
          {lesson?.content || "Konten lesson tampil di sini"}
        </div>
      </div>
    </main>
  )
}

function LessonDot({ status, active }) {
  if (status === "done") {
    return (
      <div className="relative z-10 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
        <Check className="w-4 h-4 text-white" />
      </div>
    )
  }

  if (status === "active" || active) {
    return (
      <div className="relative z-10 w-6 h-6 rounded-full border-2 border-blue-600 bg-white flex items-center justify-center">
        <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
      </div>
    )
  }

  return (
    <div className="relative z-10 w-6 h-6 rounded-full border-2 border-gray-300 bg-white" />
  )
}

function demoContent(title) {
  return `${title}

Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`
}
