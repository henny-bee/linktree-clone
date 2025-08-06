"use client"

import { useState, useEffect } from "react"
import type { LinkItemProps } from "@/hooks/use-links"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useProfile } from "@/hooks/use-profile"
import { useLinks } from "@/hooks/use-links"
import { useThemeSettings } from "@/hooks/use-theme-settings"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  Share2,
  User,
  LinkIcon,
  Palette,
  Copy,
  Eye,
  EyeOff,
  Sparkles,
  Monitor,
  Smartphone,
  Menu,
  X,
  LogOut,
} from "lucide-react"

// Import all the existing form components
import { ProfileForm } from "@/components/link-tree/profile-form"
import { LinksForm } from "@/components/link-tree/links-form"
import { ThemeForm } from "@/components/link-tree/theme-form"
import { ProfileView } from "@/components/link-tree/profile-view"

// Default data (keep all existing data)
const defaultProfile = {
  name: "Your Name",
  bio: "Add your bio here to tell people about yourself.",
  avatarUrl: "/placeholder.svg?height=96&width=96",
  secondaryBg: "bg-secondary",
  verified: false,
}

const defaultLinks: LinkItemProps[] = []

export default function EditPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [activeSection, setActiveSection] = useState("profile")
  const [shareUrl, setShareUrl] = useState("")
  const [isPreviewVisible, setIsPreviewVisible] = useState(true)
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Use all existing hooks with full functionality
  const { profile, handleProfileChange, toggleVerified, updateSecondaryBg, saveProfileChanges, updateProfile } =
    useProfile(defaultProfile)
  const { links, newLink, addLink, deleteLink, updateLink, handleNewLinkChange, updateLinksFromData } =
    useLinks(defaultLinks)
  const { themeSettings } = useThemeSettings()

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem("user")
      const storedToken = localStorage.getItem("token")

      if (!storedUser || !storedToken) {
        toast({
          title: "Authentication required",
          description: "Please login to access the editor",
          variant: "destructive",
        })
        router.push("/login")
        return
      }

      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)

        // Load user's existing data from MongoDB
        await loadUserData(userData.slug)
      } catch (error) {
        console.error("Auth check failed:", error)
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, toast])

  // Load user data from MongoDB
  const loadUserData = async (slug: string) => {
    try {
      console.log("Loading user data for slug:", slug)
      const response = await fetch(`/api/profile/${slug}`)

      if (response.ok) {
        const result = await response.json()
        const { profile: dbProfile, links: dbLinks, theme: dbTheme } = result.data

        console.log("Loaded user data:", { dbProfile, dbLinks: dbLinks?.length, dbTheme })

        // Update profile
        if (dbProfile) {
          updateProfile("name", dbProfile.name)
          updateProfile("bio", dbProfile.bio)
          updateProfile("avatarUrl", dbProfile.avatarUrl)
          updateProfile("verified", dbProfile.verified)
          updateProfile("secondaryBg", dbProfile.secondaryBg)
        }

        // Update links
        if (dbLinks && Array.isArray(dbLinks)) {
          updateLinksFromData(dbLinks)
        }

        // Update theme settings
        if (dbTheme) {
          localStorage.setItem("themeSettings", JSON.stringify(dbTheme))
          // Force theme settings to reload
          // window.location.reload()
          console.log("Theme settings updated in localStorage; consider updating theme state here if needed.")
        }

        toast({
          title: "✅ Data loaded",
          description: "Your saved settings have been loaded",
          duration: 3000,
        })
      } else {
        console.log("No existing data found, using defaults")
        // Set user's display name as default
        if (user?.displayName) {
          updateProfile("name", user.displayName)
        }
      }
    } catch (error) {
      console.error("Failed to load user data:", error)
      toast({
        title: "⚠️ Load failed",
        description: "Using default settings. Your data may not be up to date.",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  // Auto-hide preview on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsPreviewVisible(false)
      } else {
        setIsPreviewVisible(true)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Helper function to get gradient styles (for preview only)
  const getGradientStyle = (gradientType: string): string => {
    const gradients = {
      sunset: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
      ocean: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      forest: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
      midnight: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
      aurora: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      fire: "linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%)",
      purple: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      pink: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      neon: "linear-gradient(135deg, #00f5ff 0%, #ff00ff 50%, #ffff00 100%)",
      tropical: "linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffe66d 100%)",
      galaxy: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
      emerald: "linear-gradient(135deg, #50c878 0%, #228b22 100%)",
      crimson: "linear-gradient(135deg, #dc143c 0%, #8b0000 100%)",
      lavender: "linear-gradient(135deg, #e6e6fa 0%, #dda0dd 100%)",
    }
    return gradients[gradientType as keyof typeof gradients] || ""
  }

  // Modern navigation sections with enhanced structure
  const sections = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
      description: "Personal information & bio",
      badge: profile.verified ? "Verified" : null,
      color: "blue",
    },
    {
      id: "links",
      label: "Links",
      icon: LinkIcon,
      description: "Manage your social links",
      badge: links.length > 0 ? `${links.length} links` : "Empty",
      color: "green",
    },
    {
      id: "theme",
      label: "Design",
      icon: Palette,
      description: "Colors, fonts & styling",
      badge: themeSettings.colorTheme !== "default" ? "Customized" : "Default",
      color: "purple",
    },
  ]

  // Enhanced save and share functionality with proper authentication
  const handlePreviewCard = async () => {
    if (!user) {
      toast({
        title: "❌ Authentication required",
        description: "Please login to save your profile",
        variant: "destructive",
      })
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      // Save current data first
      const profileData = {
        name: profile.name,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        verified: profile.verified,
        secondaryBg: profile.secondaryBg,
      }

      console.log("Saving profile data:", { profileData, links, themeSettings })

      const response = await fetch("/api/profile/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile: profileData,
          links: links,
          themeSettings: themeSettings,
          token: token,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || result.details || "Failed to save profile")
      }

      console.log("Profile saved successfully:", result)

      toast({
        title: "🎉 Profile saved!",
        description: "Redirecting to your profile page...",
        duration: 2000,
      })

      // Navigate to the profile page using the user's slug
      const previewUrl = `/${user.slug}`
      setTimeout(() => {
        router.push(previewUrl)
      }, 1000)
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "❌ Save failed",
        description: error instanceof Error ? error.message : "Failed to save profile. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  const handleSaveAndShare = async () => {
    if (!user) {
      toast({
        title: "❌ Authentication required",
        description: "Please login to save your profile",
        variant: "destructive",
      })
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      // Save current data
      const profileData = {
        name: profile.name,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        verified: profile.verified,
        secondaryBg: profile.secondaryBg,
      }

      console.log("Saving and sharing profile:", { profileData, links, themeSettings })

      const response = await fetch("/api/profile/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile: profileData,
          links: links,
          themeSettings: themeSettings,
          token: token,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || result.details || "Failed to save profile")
      }

      console.log("Profile saved and shared:", result)

      setShareUrl(result.shareUrl)

      // Copy to clipboard if available
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(result.shareUrl)
          .then(() => {
            toast({
              title: "🎉 Profile saved & shared!",
              description: `Your profilsaya.com/${result.slug} link has been copied to clipboard`,
              duration: 5000,
            })
          })
          .catch(() => {
            toast({
              title: "✅ Profile saved!",
              description: `Your profile is now live at profilsaya.com/${result.slug}`,
              duration: 5000,
            })
          })
      } else {
        toast({
          title: "✅ Profile saved!",
          description: `Your profile is now live at profilsaya.com/${result.slug}`,
          duration: 5000,
        })
      }
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "❌ Save failed",
        description: error instanceof Error ? error.message : "Failed to save profile. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  const handleGoBack = () => {
    router.push("/")
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("profileData")
    localStorage.removeItem("linksData")
    localStorage.removeItem("themeSettings")

    toast({
      title: "👋 Logged out",
      description: "You have been logged out successfully",
      duration: 3000,
    })

    router.push("/")
  }

  const handleCopyUrl = () => {
    if (shareUrl && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          toast({
            title: "📋 Copied!",
            description: "Link copied to clipboard",
          })
        })
        .catch(() => {
          toast({
            title: "Copy failed",
            description: "Please copy the link manually",
          })
        })
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto">
            <Sparkles className="h-6 w-6 text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold">Loading your editor...</h2>
          <p className="text-muted-foreground">Please wait while we set up your workspace</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 font-sans">
      {/* Modern Header - Fully Responsive */}
      <header className="sticky top-0 z-50 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 backdrop-blur-xl dark:bg-slate-950/80 supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoBack}
                className="gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm sm:text-base"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
                    Profile Editor
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Welcome back, {user?.displayName}
                  </p>
                </div>
                <div className="sm:hidden">
                  <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Editor</h1>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Menu Toggle */}
              <Button variant="outline" size="sm" onClick={toggleMobileMenu} className="sm:hidden gap-2 bg-transparent">
                {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>

              {/* Desktop Preview Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                className="gap-2 hidden lg:flex"
              >
                {isPreviewVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="hidden xl:inline">{isPreviewVisible ? "Hide Preview" : "Show Preview"}</span>
              </Button>

              {/* Preview Card Button */}
              <Button variant="outline" size="sm" onClick={handlePreviewCard} className="gap-2 bg-transparent">
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Preview Card</span>
                <span className="sm:hidden">Preview</span>
              </Button>

              {/* Save & Share Button */}
              <Button
                onClick={handleSaveAndShare}
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base px-3 sm:px-4"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Save & Share</span>
                <span className="sm:hidden">Save</span>
              </Button>

              {/* Logout Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2 bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 sm:hidden" onClick={toggleMobileMenu}>
          <div
            className="fixed inset-y-0 left-0 w-80 bg-white dark:bg-slate-900 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Sections</h2>
              {sections.map((section) => {
                const Icon = section.icon
                const isActive = activeSection === section.id

                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id)
                      setIsMobileMenuOpen(false)
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-2 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                        : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-transparent",
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        isActive ? "bg-gradient-to-br from-blue-500 to-indigo-600" : "bg-slate-100 dark:bg-slate-800",
                      )}
                    >
                      <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-slate-600 dark:text-slate-400")} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold">{section.label}</h3>
                        {section.badge && (
                          <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
                            {section.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm opacity-75">{section.description}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div
          className={cn(
            "grid gap-4 sm:gap-8 max-w-7xl mx-auto transition-all duration-300",
            isPreviewVisible ? "lg:grid-cols-12" : "lg:grid-cols-1 max-w-4xl",
          )}
        >
          {/* Main Content */}
          <div className={cn("space-y-4 sm:space-y-6", isPreviewVisible ? "lg:col-span-8" : "lg:col-span-1")}>
            {/* Share URL Display */}
            {shareUrl && (
              <Card className="border-dashed border-2 border-emerald-200 dark:border-emerald-800 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 shadow-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0">
                      <Share2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0 w-full">
                      <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-1 text-sm sm:text-base">
                        🎉 Your link is ready!
                      </h3>
                      <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 mb-3">
                        Share this link anywhere to showcase your profile
                      </p>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <div className="flex-1 min-w-0 p-2 sm:p-3 bg-white/60 dark:bg-slate-900/60 rounded-lg border border-emerald-200 dark:border-emerald-800">
                          <code className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 break-all">
                            {shareUrl}
                          </code>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopyUrl}
                          className="flex-shrink-0 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900 bg-transparent w-full sm:w-auto"
                        >
                          <Copy className="h-4 w-4 mr-2 sm:mr-0" />
                          <span className="sm:hidden">Copy Link</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Desktop Section Navigation */}
            <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-4">
              {sections.map((section) => {
                const Icon = section.icon
                const isActive = activeSection === section.id

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      "group relative p-4 sm:p-6 rounded-2xl border-2 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] touch-manipulation",
                      isActive
                        ? "border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 shadow-lg"
                        : "border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md",
                    )}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div
                        className={cn(
                          "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all duration-200",
                          isActive
                            ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg"
                            : "bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-5 w-5 sm:h-6 sm:w-6 transition-colors",
                            isActive ? "text-white" : "text-slate-600 dark:text-slate-400",
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3
                            className={cn(
                              "font-semibold transition-colors text-sm sm:text-base",
                              isActive ? "text-blue-900 dark:text-blue-100" : "text-slate-900 dark:text-slate-100",
                            )}
                          >
                            {section.label}
                          </h3>
                          {section.badge && (
                            <Badge
                              variant={isActive ? "default" : "secondary"}
                              className={cn(
                                "text-xs font-medium",
                                isActive ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : "",
                               
                              )}
                            >
                              {section.badge}
                            </Badge>
                          )}
                        </div>
                        <p
                          className={cn(
                            "text-xs sm:text-sm transition-colors",
                            isActive ? "text-blue-700 dark:text-blue-300" : "text-slate-500 dark:text-slate-400",
                          )}
                        >
                          {section.description}
                        </p>
                      </div>
                    </div>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 pointer-events-none" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Dynamic Content Sections */}
            <div className="space-y-4 sm:space-y-6">
              {/* Profile Section */}
              {activeSection === "profile" && (
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-4 sm:pb-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg sm:text-xl text-slate-900 dark:text-slate-100">
                          Profile Settings
                        </CardTitle>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                          Manage your personal information and verification status
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ProfileForm
                      profile={profile}
                      onProfileChange={handleProfileChange}
                      onToggleVerified={toggleVerified}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Links Section */}
              {activeSection === "links" && (
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-4 sm:pb-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                        <LinkIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg sm:text-xl text-slate-900 dark:text-slate-100">
                          Links Management
                        </CardTitle>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                          Add, edit, and organize your social media and website links
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <LinksForm
                      links={links}
                      newLink={newLink}
                      onNewLinkChange={handleNewLinkChange}
                      onAddLink={addLink}
                      onDeleteLink={deleteLink}
                      onUpdateLink={updateLink}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Theme Section */}
              {activeSection === "theme" && (
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-4 sm:pb-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                        <Palette className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg sm:text-xl text-slate-900 dark:text-slate-100">
                          Design Customization
                        </CardTitle>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                          Personalize colors, fonts, layouts, and visual effects
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ThemeForm
                      profile={profile}
                      links={links}
                      onUpdateSecondaryBg={updateSecondaryBg}
                      currentTheme={theme}
                      onThemeChange={setTheme}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Live Preview Sidebar - Hidden on mobile by default */}
          {isPreviewVisible && (
            <div className="lg:col-span-4 hidden lg:block">
              <div className="sticky top-24 space-y-4">
                {/* Preview Controls */}
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <Eye className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-slate-900 dark:text-slate-100">Live Preview</CardTitle>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Real-time changes</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <button
                          title="Desktop preview"
                          onClick={() => setPreviewDevice("desktop")}
                          className={cn(
                            "p-2 rounded-md transition-colors",
                            previewDevice === "desktop"
                              ? "bg-white dark:bg-slate-700 shadow-sm"
                              : "hover:bg-slate-200 dark:hover:bg-slate-700",
                          )}
                        >
                          <Monitor className="h-4 w-4" />
                        </button>
                        <button
                          title="Mobile preview"
                          onClick={() => setPreviewDevice("mobile")}
                          className={cn(
                            "p-2 rounded-md transition-colors",
                            previewDevice === "mobile"
                              ? "bg-white dark:bg-slate-700 shadow-sm"
                              : "hover:bg-slate-200 dark:hover:bg-slate-700",
                          )}
                        >
                          <Smartphone className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* Preview Container */}
                    <div
                      className={cn(
                        "preview-container rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 transition-all duration-300",
                        previewDevice === "mobile" ? "max-w-sm mx-auto" : "w-full",
                        "min-h-[600px] relative bg-white dark:bg-slate-900",
                        // Apply theme backgrounds ONLY to preview container
                        !themeSettings.backgroundGradient || themeSettings.backgroundGradient === "none"
                          ? themeSettings.backgroundColor
                          : "",
                        themeSettings.pattern !== "none" && themeSettings.pattern,
                        themeSettings.effects.glassmorphism && "glassmorphism",
                        themeSettings.effects.blurGlass && "blur-glass",
                      )}
                      style={{
                        // Use backgroundImage for gradients to avoid conflicts
                        backgroundImage: (() => {
                          if (themeSettings.backgroundImage) {
                            return `url(${themeSettings.backgroundImage})`
                          } else if (themeSettings.backgroundGradient !== "none") {
                            return getGradientStyle(themeSettings.backgroundGradient)
                          }
                          return undefined
                        })(),
                        backgroundSize: themeSettings.backgroundImage ? "cover" : undefined,
                        backgroundPosition: themeSettings.backgroundImage ? "center" : undefined,
                        backgroundRepeat: themeSettings.backgroundImage ? "no-repeat" : undefined,
                      }}
                    >
                      {/* Pattern overlay for custom backgrounds */}
                      {themeSettings.backgroundImage && themeSettings.pattern !== "none" && (
                        <div className={cn("absolute inset-0", themeSettings.pattern)} />
                      )}

                      {/* Profile Preview */}
                      <div className="p-6 flex items-center justify-center min-h-full">
                        <div
                          className={cn(
                            "w-full transition-all duration-300 profile-view",
                            previewDevice === "mobile" ? "max-w-xs scale-90" : "max-w-sm scale-75",
                            themeSettings.font,
                          )}
                        >
                          <ProfileView profile={profile} links={links} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
