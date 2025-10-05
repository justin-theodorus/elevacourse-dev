import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabaseServer'
import { AppSidebar } from '@/components/ui/app-sidebar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen, Clock, CheckCircle, AlertCircle, Loader, Play } from 'lucide-react'
import Link from 'next/link'
import GenerateButtonClient from '../GenerateButtonClient'

function StatusBadge({ status }) {
  const label = String(status || '').toLowerCase() || 'pending'
  
  const config = {
    ready: {
      icon: CheckCircle,
      className: 'bg-green-100 text-green-800 border-green-200',
      label: 'Ready'
    },
    generating: {
      icon: Loader,
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      label: 'Generating'
    },
    failed: {
      icon: AlertCircle,
      className: 'bg-red-100 text-red-800 border-red-200',
      label: 'Failed'
    },
    pending: {
      icon: Clock,
      className: 'bg-gray-100 text-gray-800 border-gray-200',
      label: 'Pending'
    }
  }

  const { icon: Icon, className, label: displayLabel } = config[label] || config.pending

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      {displayLabel}
    </div>
  )
}

function CourseCard({ item, pathId, index }) {
  const isReuse = item.type === 'reuse'
  const isReady = item.status === 'ready' && item.course_id
  const isPending = (item.status || 'pending') === 'pending'
  const isGenerating = item.status === 'generating'

  const getTitle = () => {
    if (isReuse) {
      return item.course_title || `Course ${item.course_id || 'Unknown'}`
    }
    return item.new_title || 'Untitled Course'
  }

  const getDescription = () => {
    if (isReuse) {
      return 'This course already exists and will be reused in your learning path.'
    }
    return item.note || 'This course will be generated based on your learning path requirements.'
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-500">Step {item.idx}</span>
              <StatusBadge status={item.status || (isReuse ? 'ready' : 'pending')} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {getTitle()}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {getDescription()}
            </p>
            {isReuse && (
              <div className="mt-3">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Existing Course
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>~2-4 weeks</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{isReuse ? 'Reused' : 'New'} Course</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isReuse && isPending && (
            <GenerateButtonClient 
              pathId={pathId} 
              idx={item.idx} 
              newTitle={item.new_title} 
              note={item.note || ''} 
            />
          )}
          
          {isGenerating && (
            <Button disabled variant="outline" className="cursor-not-allowed">
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </Button>
          )}

          {isReady && (
            <Link href={`/courses/${item.course_id}?path=${pathId}`}>
              <Button className="inline-flex items-center gap-2">
                <Play className="w-4 h-4" />
                Start Course
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default async function PathPage({ params }) {
  const supabase = await createClient()
  const id = (await params)?.id
  if (!id) return notFound()

  const { data, error } = await supabase
    .from('learning_paths')
    .select('id, user_prompt, title, created_at, path_items(*)')
    .eq('id', id)
    .single()

  if (error || !data) return notFound()

  const items = (data.path_items || []).slice().sort((a, b) => a.idx - b.idx)

  // Fetch titles for reused items
  const reuseIds = items.filter(i => i.type === 'reuse' && i.course_id).map(i => i.course_id)
  let titles = new Map()
  if (reuseIds.length) {
    const { data: embRows } = await supabase
      .from('course_embeddings')
      .select('course_id, title')
      .in('course_id', reuseIds)
    if (Array.isArray(embRows)) {
      titles = new Map(embRows.map(r => [r.course_id, r.title]))
    }
  }
  const itemsWithTitles = items.map(i => i.type === 'reuse' ? { ...i, course_title: titles.get(i.course_id) || null } : i)

  // Calculate progress
  const totalCourses = itemsWithTitles.length
  const readyCourses = itemsWithTitles.filter(item => 
    item.status === 'ready' || (item.type === 'reuse' && item.course_id)
  ).length
  const progressPercentage = totalCourses > 0 ? Math.round((readyCourses / totalCourses) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar isExpanded={true} />
      
      <main className="ml-64">
        <div className="p-8">
          {/* Header Navigation */}
          <div className="mb-6">
            <Link 
              href="/learning-path"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Learning Paths
            </Link>
          </div>

          <div className="max-w-4xl">
            {/* Learning Path Header */}
            <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm border">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-3">
                    Your Learning Path
                  </h1>
                  <p className="text-xl text-gray-600 mb-4">
                    {data.title || data.user_prompt}
                  </p>
                  
                  {/* Path Stats */}
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{totalCourses} course{totalCourses !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>{readyCourses} ready</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>~{totalCourses * 3} weeks total</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Path Progress</span>
                  <span>{progressPercentage}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 rounded-full h-3 transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3">
                <Button variant="outline">
                  Share Path
                </Button>
                <Button variant="outline">
                  Export to PDF
                </Button>
              </div>
            </div>

            {/* Courses Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Sequence</h2>
              
              {itemsWithTitles.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center shadow-sm border">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses in this path</h3>
                  <p className="text-gray-500">
                    This learning path doesn't have any courses yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {itemsWithTitles.map((item, index) => (
                    <CourseCard 
                      key={item.idx} 
                      item={item} 
                      pathId={data.id} 
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


