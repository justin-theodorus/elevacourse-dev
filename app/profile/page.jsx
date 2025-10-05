"use client"

import { useState, useEffect } from "react"
import { User, Mail, Calendar, Shield, LogOut, ChevronRight, Settings, Edit } from "lucide-react"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function ProfilePage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/auth/user')
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  async function handleSignOut() {
    try {
      const response = await fetch('/auth/signout', {
        method: 'POST',
      })
      if (response.ok) {
        window.location.href = '/'
      }
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppSidebar 
          isExpanded={sidebarExpanded} 
          onToggle={() => setSidebarExpanded(!sidebarExpanded)} 
        />
        <main className={`transition-all duration-300 ${sidebarExpanded ? 'ml-64' : 'ml-20'}`}>
          <div className="p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto mb-6"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppSidebar 
          isExpanded={sidebarExpanded} 
          onToggle={() => setSidebarExpanded(!sidebarExpanded)} 
        />
        <main className={`transition-all duration-300 ${sidebarExpanded ? 'ml-64' : 'ml-20'}`}>
          <div className="p-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
              <p className="text-gray-600 mb-6">Please sign in to view your profile.</p>
              <Button asChild>
                <a href="/login">Sign In</a>
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
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
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
                  <p className="text-gray-600">Manage your account settings and preferences</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="text-center">
                  {user.user_metadata?.avatar_url ? (
                    <img
                      className="w-24 h-24 rounded-full border-4 border-primary/20 mx-auto mb-4"
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl font-bold">
                        {user.user_metadata?.full_name?.charAt(0) ||
                          user.email?.charAt(0) ||
                          '?'}
                      </span>
                    </div>
                  )}
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {user.user_metadata?.full_name || 'User'}
                  </h2>
                  <p className="text-gray-600 mb-6">{user.email}</p>
                  
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(user.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}</span>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mb-4"
                    onClick={() => {/* TODO: Implement edit profile */}}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Account Details</h3>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <User className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">
                          {user.user_metadata?.full_name || 'Not provided'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Email Address</label>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">{user.email}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Authentication Provider</label>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <Shield className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900 capitalize">
                          {user.app_metadata?.provider || 'Google'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Last Sign In</label>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">
                          {new Date(user.last_sign_in_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">User ID</label>
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                        <Shield className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900 font-mono text-sm">{user.id}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start h-auto p-4" asChild>
                    <a href="/dashboard">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Go to Dashboard</div>
                          <div className="text-sm text-gray-500">View your courses and progress</div>
                        </div>
                      </div>
                    </a>
                  </Button>

                  <Button variant="outline" className="justify-start h-auto p-4" asChild>
                    <a href="/learning-path">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Settings className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium">Create Learning Path</div>
                          <div className="text-sm text-gray-500">Generate personalized courses</div>
                        </div>
                      </div>
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
