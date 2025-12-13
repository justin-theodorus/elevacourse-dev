import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabaseServer'
import { AppSidebar } from '@/components/ui/app-sidebar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen, Clock, Users, Star, Play } from 'lucide-react'
import Link from 'next/link'

export default async function CoursePage({ params, searchParams }) {
  const supabase = await createClient()
  const id = (await params)?.id

  if (!id) return notFound()

  const { data: course, error: courseErr } = await supabase
    .from('courses')
    .select('id, title, subtitle, description, level, tags')
    .eq('id', id)
    .single()

  if (courseErr || !course) return notFound()

  const { data: lessons, error: lessonsErr } = await supabase
    .from('lessons')
    .select('id, idx, title')
    .eq('course_id', id)
    .order('idx', { ascending: true })

  if (lessonsErr) return notFound()

  const pathParam = (await searchParams)?.get ? (await searchParams).get('path') : (await searchParams)?.path
  const backHref = pathParam ? `/paths/${pathParam}` : '/courses'

  // Mock data for course stats - replace with real data
  const courseStats = {
    duration: '8 weeks',
    students: '1,234',
    rating: 4.8,
    difficulty: course.level || 'Intermediate'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar isExpanded={true} />
      
      <main className="ml-64">
        <div className="p-8">
          {/* Back Navigation */}
          <div className="mb-6">
            <Link 
              href={backHref}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {pathParam ? 'learning path' : 'courses'}
            </Link>
          </div>

          <div className="max-w-4xl">
            {/* Course Header */}
            <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm border">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">{course.title}</h1>
                  {course.subtitle && (
                    <p className="text-xl text-gray-600 mb-4">{course.subtitle}</p>
                  )}
                  
                  {/* Course Stats */}
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{courseStats.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{courseStats.students} students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{courseStats.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{courseStats.difficulty}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" size="lg">
                    Save Course
                  </Button>
                  <Button size="lg" className="px-8">
                    Start Learning
                  </Button>
                </div>
              </div>

              {/* Tags */}
              {course.tags && course.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {course.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About this course</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {course.description}
                </div>
              </div>
            </div>

            {/* Lessons Section */}
            {!!(lessons?.length) && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
                  <span className="text-sm text-gray-600">
                    {lessons.length} lesson{lessons.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <div 
                      key={lesson.id} 
                      className="group border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center transition-colors">
                            <Play className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-900">
                              Lesson {lesson.idx}: {lesson.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Duration: ~15 minutes
                            </p>
                          </div>
                        </div>
                        
                        <Link 
                          href={pathParam ? `/lessons/${lesson.id}?path=${pathParam}` : `/lessons/${lesson.id}`}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Button variant="outline" size="sm">
                            Start Lesson
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}


