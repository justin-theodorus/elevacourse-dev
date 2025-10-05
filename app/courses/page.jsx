"use client"

import { useState } from "react"
import { Search, ChevronRight } from "lucide-react"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { CourseCard } from "@/components/ui/course-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function CoursesPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for courses - replace with real data from your API
  const courses = [
    {
      id: 1,
      title: "Data Mining",
      description: "Belajar teknik dasar pengolahan dan analisis data untuk menemukan pola serta informasi penting dari data besar.",
      progress: 95,
      lessonsCompleted: 12,
      totalLessons: 15,
    },
    {
      id: 2,
      title: "Machine Learning",
      description: "Comprehensive guide to machine learning algorithms and applications for modern data science.",
      progress: 75,
      lessonsCompleted: 9,
      totalLessons: 12,
    },
    {
      id: 3,
      title: "Web Development",
      description: "Full-stack web development with modern technologies including React, Node.js, and databases.",
      progress: 60,
      lessonsCompleted: 8,
      totalLessons: 14,
    },
    {
      id: 4,
      title: "Python Programming",
      description: "Learn Python programming from basics to advanced concepts including data structures and algorithms.",
      progress: 85,
      lessonsCompleted: 17,
      totalLessons: 20,
    },
    {
      id: 5,
      title: "Database Design",
      description: "Master database design principles, SQL queries, and database optimization techniques.",
      progress: 40,
      lessonsCompleted: 6,
      totalLessons: 15,
    },
    {
      id: 6,
      title: "Cloud Computing",
      description: "Introduction to cloud platforms, services, and deployment strategies for modern applications.",
      progress: 30,
      lessonsCompleted: 4,
      totalLessons: 12,
    },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Redirect to course generation or search results
      window.location.href = `/learning-path?prompt=${encodeURIComponent(searchQuery)}`
    }
  }

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
          <section>
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold text-gray-900">Courses</h1>
              <div className="text-sm text-gray-600">
                {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
              </div>
            </div>
            
            {filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto mb-4" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery ? `No courses match "${searchQuery}"` : "You haven't enrolled in any courses yet"}
                </p>
                <Button 
                  onClick={() => window.location.href = '/learning-path'}
                  className="px-6 py-2"
                >
                  Explore Learning Paths
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredCourses.map((course) => (
                  <div key={course.id} className="cursor-pointer" onClick={() => window.location.href = `/courses/${course.id}`}>
                    <CourseCard
                      title={course.title}
                      description={course.description}
                      progress={course.progress}
                      lessonsCompleted={course.lessonsCompleted}
                      totalLessons={course.totalLessons}
                      variant="default"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
