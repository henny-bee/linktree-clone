"use client"

import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { ProfileView } from "@/components/link-tree/profile-view"
import { useThemeSettings } from "@/hooks/use-theme-settings"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Edit, Loader2 } from "lucide-react"
import Link from "next/link"

import type { LinkItemProps } from "@/hooks/use-links"

// Default profile data
const defaultProfile = {
  name: "User Profile",
  bio: "Welcome to my link page",
  avatarUrl: "/placeholder.svg?height=96&width=96",
  secondaryBg: "bg-secondary",
  verified: false,
}

// Default links data
const defaultLinks: LinkItemProps[] = []

interface LinkTreeProps {
  username?: string
  themeData?: string
}

export default function LinkTree({ username, themeData }: LinkTreeProps) {
  const { toast } = useToast()
  const { theme } = useTheme()
  const { themeSettings } = useThemeSettings()

  const [profile, setProfile] = useState(defaultProfile)
  const [links, setLinks] = useState(defaultLinks)
  const [isLoading, setIsLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profileNotFound, setProfileNotFound] = useState(false)

  // Helper function to get gradient styles
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

  // Load data from MongoDB when username is provided
  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      if (!username) {
        setDataLoaded(true)
        return
      }

      setIsLoading(true)

      try {
        console.log("Loading profile data for username:", username)
        const response = await fetch(`/api/profile/${username}`)

        if (response.ok) {
          const result = await response.json()
          const { profile: dbProfile, links: dbLinks, theme: dbTheme } = result.data

          console.log("Profile data loaded:", { dbProfile, dbLinks: dbLinks?.length, dbTheme })

          if (isMounted) {
            // Update profile
            if (dbProfile) {
              setProfile({
                name: dbProfile.name,
                bio: dbProfile.bio,
                avatarUrl: dbProfile.avatarUrl,
                secondaryBg: dbProfile.secondaryBg,
                verified: dbProfile.verified,
              })
            }

            // Update links
            if (dbLinks && Array.isArray(dbLinks)) {
              setLinks(dbLinks)
            }

            // Update theme settings
            if (dbTheme) {
              localStorage.setItem("themeSettings", JSON.stringify(dbTheme))
              // Notify themeSettings hook to re-sync
              if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("themeSettingsUpdated"))
              }
              // Apply theme settings immediately
              const root = document.documentElement

              // Apply CSS variables for theme
              if (dbTheme.fontColors) {
                root.style.setProperty("--font-color-display-name", dbTheme.fontColors.displayName)
                root.style.setProperty("--font-color-bio", dbTheme.fontColors.bio)
                root.style.setProperty("--font-color-link-title", dbTheme.fontColors.linkTitle)
                root.style.setProperty("--font-color-link-url", dbTheme.fontColors.linkUrl)
              }

              if (dbTheme.effects) {
                root.style.setProperty(
                  "--glassmorphism-opacity",
                  dbTheme.effects.glassmorphismOpacity?.toString() || "0.1",
                )
                root.style.setProperty("--blur-intensity", `${dbTheme.effects.blurIntensity || 10}px`)
                root.style.setProperty("--animation-speed", `${dbTheme.effects.animationSpeed || 400}ms`)
                root.style.setProperty("--card-opacity", dbTheme.effects.cardOpacity?.toString() || "1")
              }
            }

            toast({
              title: "✅ Profile loaded",
              description: `Welcome to ${dbProfile?.name || username}'s page`,
              duration: 3000,
            })
          }
        } else {
          console.log("Profile not found for username:", username)
          if (isMounted) {
            setProfileNotFound(true)
            toast({
              title: "❌ Profile not found",
              description: "This profile doesn't exist or hasn't been created yet",
              variant: "destructive",
              duration: 5000,
            })
          }
        }
      } catch (error) {
        console.error("Failed to load profile data:", error)
        if (isMounted) {
          toast({
            title: "❌ Load failed",
            description: "Failed to load profile data",
            variant: "destructive",
            duration: 5000,
          })
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
          setDataLoaded(true)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [username, toast])

  // Apply font family when theme changes
  useEffect(() => {
    if (dataLoaded) {
      document.documentElement.classList.remove(
        "font-sans",
        "font-serif",
        "font-mono",
        "font-display",
        "font-body",
        "font-slab",
        "font-rounded",
        "font-code",
      )
      document.documentElement.classList.add(themeSettings.font)
    }
  }, [themeSettings.font, dataLoaded])

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user:", error)
      }
    }
  }, [])

  // Show loading only when actually loading from database
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col items-center justify-start p-4 pt-8 transition-all duration-300",
        themeSettings.font,
        // Apply theme backgrounds
        !themeSettings.backgroundGradient || themeSettings.backgroundGradient === "none"
          ? themeSettings.backgroundColor
          : "",
        themeSettings.pattern !== "none" && themeSettings.pattern,
        themeSettings.effects.glassmorphism && "glassmorphism",
        themeSettings.effects.blurGlass && "blur-glass",
      )}
      style={{
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

      <div className="max-w-3xl mx-auto w-full relative z-10">
        {/* Header with Edit Button */}
        <div className="flex justify-between items-center mb-6 px-4">
          <h1 className="text-2xl font-bold">profilsaya.com</h1>
          {profileNotFound && (
            <Link href="/login">
              <Button variant="outline" size="sm" className="gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                Create Your Page
              </Button>
            </Link>
          )}
        </div>

        <div className="w-full max-w-md mx-auto">
          <ProfileView profile={profile} links={links} />
        </div>
      </div>
    </div>
  )
}
