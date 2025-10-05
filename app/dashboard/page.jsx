"use client"

import { useState } from "react"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { CourseCard } from "@/components/ui/course-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Dashboard() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data - replace with real data from your API
  const courses = [
    {
      title: "Data Mining",
      description: "Learn the fundamentals of data mining and analysis techniques",
      progress: 95,
      lessonsCompleted: 12,
      totalLessons: 15,
    },
    {
      title: "Machine Learning",
      description: "Comprehensive guide to machine learning algorithms and applications",
      progress: 75,
      lessonsCompleted: 9,
      totalLessons: 12,
    },
    {
      title: "Web Development",
      description: "Full-stack web development with modern technologies",
      progress: 60,
      lessonsCompleted: 8,
      totalLessons: 14,
    },
  ]

  const recentLessons = [
    {
      id: 1,
      title: "Introduction to Data Mining",
      description: "Continue this lesson to move closer to completion",
      timeAgo: "30 mins ago",
      course: "Data Mining",
    },
    {
      id: 2,
      title: "Neural Networks Basics",
      description: "Continue this lesson to move closer to completion",
      timeAgo: "30 mins ago",
      course: "Machine Learning",
    },
    {
      id: 3,
      title: "React Components",
      description: "Continue this lesson to move closer to completion",
      timeAgo: "30 mins ago",
      course: "Web Development",
    },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Redirect to course generation or search results
      window.location.href = `/learning-path?prompt=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar 
        isExpanded={sidebarExpanded} 
        onToggle={() => setSidebarExpanded(!sidebarExpanded)} 
      />
      
      <main className={`transition-all duration-300 ${sidebarExpanded ? 'ml-64' : 'ml-20'}`}>
        <div className="p-8">
          {/* Header with Search */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              {!sidebarExpanded && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarExpanded(true)}
                  className="p-2"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              )}
              <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search courses or make a new one with AI..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 w-full rounded-full border-gray-200 focus:border-primary focus:ring-primary"
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Courses Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Courses</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="p-2">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="p-2">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex gap-6 overflow-x-auto pb-4">
              {courses.map((course, index) => (
                <div key={index} className="flex-shrink-0">
                  <CourseCard
                    title={course.title}
                    description={course.description}
                    progress={course.progress}
                    lessonsCompleted={course.lessonsCompleted}
                    totalLessons={course.totalLessons}
                    variant="compact"
                  />
                </div>
              ))}
            </div>
            
            {/* Pagination dots */}
            <div className="flex justify-center gap-2 mt-4">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            </div>
          </section>

          {/* Last Lesson Accessed Section */}
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Last Lesson Accessed</h2>
            <div className="space-y-4">
              {recentLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="bg-gradient-to-br from-primary to-blue-400 rounded-2xl p-6 text-white"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm opacity-90">{lesson.timeAgo}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{lesson.title}</h3>
                      <p className="text-white/90 mb-4">{lesson.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                        {lesson.course}
                      </span>
                      <Button 
                        className="bg-white text-primary hover:bg-white/90 px-6 py-2 rounded-full font-medium"
                        onClick={() => window.location.href = `/lessons/${lesson.id}`}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
