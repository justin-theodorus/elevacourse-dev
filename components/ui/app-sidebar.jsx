"use client"

import { useState, useEffect } from "react"
import { BookOpen, Grid2x2, Bell, Settings, Info, ChevronRight, Sparkles, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import PropTypes from "prop-types"
import { cn } from "@/lib/utils"

export function AppSidebar({ isExpanded, onToggle }) {
  const pathname = usePathname()
  const [user, setUser] = useState(null)

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
      }
    }

    fetchUser()
  }, [])

  const navItems = [
    { icon: Grid2x2, label: "Dashboard", href: "/dashboard" },
    { icon: BookOpen, label: "Courses", href: "/courses" },
    { icon: Sparkles, label: "Learning Path", href: "/learning-path" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: Info, label: "Support", href: "/support" },
  ]

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-border transition-all duration-300 z-50",
        isExpanded ? "w-64" : "w-20",
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo and Toggle */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          {isExpanded ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">ElevaCourse</span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mx-auto">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
          )}
          <button
            onClick={onToggle}
            className={cn("p-1 hover:bg-accent rounded-md transition-colors", !isExpanded && "hidden")}
            aria-label="Toggle sidebar"
            type="button"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                      isActive
                        ? "bg-accent text-primary font-medium"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      !isExpanded && "justify-center",
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {isExpanded && <span>{item.label}</span>}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User Profile */}
        {isExpanded && (
          <div className="p-4 border-t border-border">
            <Link 
              href="/profile"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors group"
            >
              {user?.user_metadata?.avatar_url ? (
                <img
                  className="w-10 h-10 rounded-full border-2 border-primary/20"
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-semibold">
                  {user?.user_metadata?.full_name?.charAt(0) || 
                   user?.email?.charAt(0) || 
                   <User className="w-5 h-5" />}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">Welcome back</p>
                <p className="font-medium truncate">
                  {user?.user_metadata?.full_name || 
                   user?.email?.split('@')[0] || 
                   'User'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>
          </div>
        )}

        {/* Collapsed User Profile */}
        {!isExpanded && (
          <div className="p-4 border-t border-border">
            <Link 
              href="/profile"
              className="flex items-center justify-center p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
            >
              {user?.user_metadata?.avatar_url ? (
                <img
                  className="w-8 h-8 rounded-full border-2 border-primary/20"
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-sm font-semibold">
                  {user?.user_metadata?.full_name?.charAt(0) || 
                   user?.email?.charAt(0) || 
                   <User className="w-4 h-4" />}
                </div>
              )}
            </Link>
          </div>
        )}
      </div>
    </aside>
  )
}

AppSidebar.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
}
