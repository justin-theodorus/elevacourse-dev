"use client"

import { useState, useEffect } from 'react'
import { notFound, useRouter } from 'next/navigation'
import { AppSidebar } from '@/components/ui/app-sidebar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, BookOpen, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Markdown } from '@/components/ui/markdown'

export default function LessonPage({ params, searchParams }) {
  const router = useRouter()
  const [lesson, setLesson] = useState(null)
  const [course, setCourse] = useState(null)
  const [allLessons, setAllLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const resolvedParams = await params
        const resolvedSearchParams = await searchParams
        const id = resolvedParams?.id

        if (!id) {
          setError('No lesson ID provided')
          return
        }

        // Fetch lesson data
        const lessonResponse = await fetch(`/api/lessons/${id}`)
        if (!lessonResponse.ok) {
          setError('Lesson not found')
          return
        }
        const lessonData = await lessonResponse.json()
        setLesson(lessonData)

        // Fetch course data and all lessons
        const courseResponse = await fetch(`/api/courses/${lessonData.course_id}`)
        if (courseResponse.ok) {
          const courseData = await courseResponse.json()
          setCourse(courseData.course)
          setAllLessons(courseData.lessons || [])
        }

      } catch (err) {
        setError('Failed to load lesson')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppSidebar isExpanded={true} />
        <main className="ml-64">
          <div className="p-8">
            <div className="max-w-4xl">
              <div className="bg-white rounded-2xl p-8 shadow-sm border">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error || !lesson) {
    return notFound()
  }

  const currentLessonIndex = allLessons?.findIndex(l => l.id === lesson.id) ?? -1
  const previousLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null
  const nextLesson = currentLessonIndex < (allLessons?.length ?? 0) - 1 ? allLessons[currentLessonIndex + 1] : null

  const handleMarkComplete = () => {
    // Add your mark complete logic here
    console.log('Marking lesson as complete')
  }

  const handleBackToCourse = () => {
    router.back()
  }

  const handleCompleteCourse = () => {
    const pathParam = new URLSearchParams(window.location.search).get('path')
    const backHref = pathParam && lesson?.course_id
      ? `/courses/${lesson.course_id}?path=${pathParam}`
      : `/courses/${lesson?.course_id || ''}`
    router.push(backHref)
  }

  const pathParam = new URLSearchParams(window.location.search).get('path')
  const backHref = pathParam && lesson?.course_id
    ? `/courses/${lesson.course_id}?path=${pathParam}`
    : `/courses/${lesson?.course_id || ''}`

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar isExpanded={true} />
      
      <main className="ml-64">
        <div className="p-8">
          {/* Header Navigation */}
          <div className="mb-6">
            <Link 
              href={backHref}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {course?.title || 'course'}
            </Link>
          </div>

          <div className="max-w-4xl">
            {/* Lesson Header */}
            <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm border">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">
                        {course?.title}
                      </p>
                      <h1 className="text-3xl font-bold text-gray-900">
                        Lesson {lesson.idx}: {lesson.title}
                      </h1>
                    </div>
                  </div>
                  
                  {/* Lesson Stats */}
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>~15 minutes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>Lesson {lesson.idx} of {allLessons?.length || 0}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" size="lg" onClick={handleMarkComplete}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Complete
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              {allLessons && allLessons.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Course Progress</span>
                    <span>{Math.round((lesson.idx / allLessons.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 rounded-full h-2 transition-all"
                      style={{ width: `${(lesson.idx / allLessons.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Lesson Content */}
            <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm border">
              <article className="prose prose-lg max-w-none">
                <Markdown content={lesson.content} />
              </article>
            </div>

            {/* Navigation Footer */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {previousLesson ? (
                    <Link 
                      href={pathParam ? `/lessons/${previousLesson.id}?path=${pathParam}` : `/lessons/${previousLesson.id}`}
                      className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <div className="text-left">
                        <div className="text-xs text-gray-500">Previous</div>
                        <div className="font-medium">Lesson {previousLesson.idx}: {previousLesson.title}</div>
                      </div>
                    </Link>
                  ) : (
                    <div></div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleBackToCourse}>
                    Back to Course
                  </Button>
                  
                  {nextLesson ? (
                    <Link href={pathParam ? `/lessons/${nextLesson.id}?path=${pathParam}` : `/lessons/${nextLesson.id}`}>
                      <Button className="inline-flex items-center gap-2">
                        Next Lesson
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Button 
                      onClick={handleCompleteCourse}
                      className="inline-flex items-center gap-2"
                    >
                      Complete Course
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


