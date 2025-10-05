"use client"

import { useEffect, useState } from "react"
import { Sparkles, ChevronRight, BookOpen, Clock, CheckCircle, AlertCircle, Loader2, ArrowRight, History, Calendar } from "lucide-react"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function StatusBadge({ status }) {
  const configs = {
    ready: {
      icon: CheckCircle,
      label: "Ready",
      className: "bg-green-100 text-green-800 border-green-200"
    },
    generating: {
      icon: Loader2,
      label: "Generating",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200"
    },
    failed: {
      icon: AlertCircle,
      label: "Failed",
      className: "bg-red-100 text-red-800 border-red-200"
    },
    pending: {
      icon: Clock,
      label: "Pending",
      className: "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const config = configs[status] || configs.pending
  const Icon = config.icon

  return (
    <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border", config.className)}>
      <Icon className={cn("w-3 h-3", status === "generating" && "animate-spin")} />
      {config.label}
    </div>
  )
}

function PathItem({ item, onGenerate }) {
  const computedStatus = item.status || (item.type === 'reuse' ? 'ready' : 'pending')
  const titleLine = item.type === 'reuse'
    ? `Reuse existing course${item.course_id ? ` (${item.course_id})` : ''}`
    : `${item.new_title || 'Untitled'}`

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
              {item.idx}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{titleLine}</h3>
              {item.type === 'reuse' && (
                <p className="text-sm text-primary font-medium">Existing Course</p>
              )}
            </div>
          </div>
          {(item.note || item.brief) && (
            <p className="text-gray-600 text-sm leading-relaxed ml-11">
              {item.note || item.brief}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <StatusBadge status={computedStatus} />
          
          {item.type === 'new' && computedStatus === 'pending' && (
            <Button
              onClick={() => onGenerate(item)}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate
            </Button>
          )}
          
          {computedStatus === 'failed' && (
            <Button
              onClick={() => onGenerate(item)}
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium"
            >
              Retry
            </Button>
          )}
          
          {computedStatus === 'ready' && item.course_id && (
            <Button
              asChild
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              <a href={`/courses/${item.course_id}${item.path_id ? `?path=${item.path_id}` : ''}`}>
                <ArrowRight className="w-4 h-4 mr-2" />
                Open
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function PastLearningPaths({ paths, onSelectPath }) {
  if (!paths || paths.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
        <div className="text-center py-8">
          <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Previous Learning Paths</h3>
          <p className="text-gray-500">Create your first learning path above to get started!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <History className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold text-gray-900">Your Previous Learning Paths</h2>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          {paths.length} {paths.length === 1 ? 'Path' : 'Paths'}
        </div>
      </div>
      
      <div className="space-y-4">
        {paths.map((path) => (
          <div
            key={path.id}
            className="border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer group"
            onClick={() => onSelectPath(path)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                    {path.title || 'Untitled Learning Path'}
                  </h3>
                </div>
                
                {path.user_prompt && (
                  <p className="text-gray-600 text-sm leading-relaxed ml-11 mb-3 line-clamp-2">
                    {path.user_prompt}
                  </p>
                )}
                
                <div className="flex items-center gap-4 ml-11 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(path.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </div>
                  {path.updated_at !== path.created_at && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Updated {new Date(path.updated_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity border-primary/20 text-primary hover:bg-primary/5"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectPath(path)
                  }}
                >
                  <ArrowRight className="w-4 h-4 mr-1" />
                  Open
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LearningPathPage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [prompt, setPrompt] = useState('')
  const [pathId, setPathId] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [pastPaths, setPastPaths] = useState([])
  const [loadingPastPaths, setLoadingPastPaths] = useState(true)

  // Fetch past learning paths
  useEffect(() => {
    async function fetchPastPaths() {
      try {
        const response = await fetch('/api/paths')
        if (response.ok) {
          const data = await response.json()
          setPastPaths(data)
        } else {
          console.error('Failed to fetch past paths')
        }
      } catch (error) {
        console.error('Error fetching past paths:', error)
      } finally {
        setLoadingPastPaths(false)
      }
    }

    fetchPastPaths()
  }, [])

  // Allow deep-linking back to a specific learning path via ?path=ID
  // Also handle prompt parameter from dashboard search
  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search)
      const p = sp.get('path')
      const promptParam = sp.get('prompt')
      if (p) setPathId(p)
      if (promptParam) setPrompt(decodeURIComponent(promptParam))
    } catch {}
  }, [])

  async function createPlan() {
    setLoading(true)
    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      
      if (res.ok) {
        // redirect to the dedicated path page
        if (data.redirect) {
          window.location.assign(data.redirect)
          return
        }
        setPathId(data.path_id)
        setItems(data.items)
        
        // Refresh past paths to include the newly created one
        const response = await fetch('/api/paths')
        if (response.ok) {
          const updatedPaths = await response.json()
          setPastPaths(updatedPaths)
        }
      } else {
        alert(data.error ?? 'Failed to plan')
      }
    } catch (error) {
      console.error('Error creating plan:', error)
      alert('Failed to create plan. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function generateOne(item) {
    if (!pathId || item.type !== 'new' || !item.new_title) return
    
    setItems((prev) => prev.map((p) => (p.idx === item.idx ? { ...p, status: 'generating' } : p)))

    try {
      const res = await fetch('/api/generate-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path_id: pathId,
          idx: item.idx,
          new_title: item.new_title,
          prompt: item.note ?? '',
        }),
      })
      
      if (!res.ok) {
        setItems((prev) => prev.map((p) => (p.idx === item.idx ? { ...p, status: 'failed' } : p)))
      }
    } catch (error) {
      console.error('Error generating course:', error)
      setItems((prev) => prev.map((p) => (p.idx === item.idx ? { ...p, status: 'failed' } : p)))
    }
  }

  function handleSelectPath(path) {
    // Navigate to the specific path page
    window.location.href = `/paths/${path.id}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar 
        isExpanded={sidebarExpanded} 
        onToggle={() => setSidebarExpanded(!sidebarExpanded)} 
      />
      
      <main className={`transition-all duration-300 ${sidebarExpanded ? 'ml-64' : 'ml-20'}`}>
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Generate Learning Path</h1>
                  <p className="text-gray-600">Create a personalized learning journey with AI</p>
                </div>
              </div>
            </div>
          </div>

          {/* Prompt Input Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8 shadow-sm">
            <div className="max-w-4xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What would you like to learn?</h2>
              <div className="space-y-4">
                <textarea
                  className="w-full border border-gray-200 rounded-xl p-4 text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
                  rows={4}
                  placeholder="Describe what you want to learn. For example: 'I want to learn data science from basics to advanced machine learning' or 'Help me understand web development with React and Node.js'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Our AI will analyze your request and create a structured learning path
                  </p>
                  <Button
                    onClick={createPlan}
                    disabled={loading || !prompt.trim()}
                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Planning...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Create Learning Path
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Past Learning Paths Section */}
          {!loadingPastPaths && (
            <div className="mb-8">
              <PastLearningPaths 
                paths={pastPaths} 
                onSelectPath={handleSelectPath}
              />
            </div>
          )}

          {/* Learning Path Items */}
          {items.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">Your Learning Path</h2>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {items.length} {items.length === 1 ? 'Step' : 'Steps'}
                </div>
              </div>
              
              <div className="space-y-4">
                {items.map((item) => (
                  <PathItem
                    key={item.idx}
                    item={{ ...item, path_id: pathId }}
                    onGenerate={generateOne}
                  />
                ))}
              </div>
              
              {/* Progress Summary */}
              <div className="bg-gradient-to-br from-primary/5 to-blue-50 rounded-2xl p-6 border border-primary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Path Progress</h3>
                    <p className="text-gray-600 text-sm">
                      {items.filter(item => (item.status || (item.type === 'reuse' ? 'ready' : 'pending')) === 'ready').length} of {items.length} steps ready
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {items.some(item => (item.status || (item.type === 'reuse' ? 'ready' : 'pending')) === 'ready') && (
                      <Button
                        asChild
                        className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium"
                      >
                        <a href={`/paths/${pathId}`}>
                          <ArrowRight className="w-4 h-4 mr-2" />
                          View Full Path
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
