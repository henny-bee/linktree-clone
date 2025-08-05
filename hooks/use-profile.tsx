"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export interface Profile {
  name: string
  bio: string
  avatarUrl: string
  secondaryBg: string
  verified: boolean
}

export function useProfile(initialProfile: Profile | (() => Profile)) {
  const { toast } = useToast()

  // Initialize with data from localStorage if available, otherwise use initialProfile
  const [profile, setProfile] = useState<Profile>(() => {
    const defaultProfile = typeof initialProfile === "function" ? initialProfile() : initialProfile

    if (typeof window !== "undefined") {
      const savedProfile = localStorage.getItem("profileData")
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile)
          return {
            name: parsed.name || defaultProfile.name,
            bio: parsed.bio || defaultProfile.bio,
            avatarUrl: parsed.avatarUrl || defaultProfile.avatarUrl,
            secondaryBg: parsed.secondaryBg || defaultProfile.secondaryBg,
            verified: parsed.verified !== undefined ? parsed.verified : defaultProfile.verified,
          }
        } catch (error) {
          console.error("Failed to parse saved profile:", error)
        }
      }
    }
    return defaultProfile
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Handle profile field changes
  const updateProfile = (field: keyof Profile, value: string | boolean) => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      }
      // Save to localStorage immediately for local state
      localStorage.setItem("profileData", JSON.stringify(updated))
      return updated
    })
  }

  // Handle form field changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateProfile(name as keyof Profile, value)
  }

  // Toggle verified status
  const toggleVerified = () => {
    updateProfile("verified", !profile.verified)
  }

  // Update secondary background
  const updateSecondaryBg = (bgColor: string) => {
    updateProfile("secondaryBg", bgColor)
  }

  // Save profile to MongoDB
  const saveToDatabase = async () => {
    setIsSaving(true)
    try {
      // Get current data from localStorage
      const profileData = JSON.parse(localStorage.getItem("profileData") || JSON.stringify(profile))
      const linksData = JSON.parse(localStorage.getItem("linksData") || "[]")
      const themeData = JSON.parse(localStorage.getItem("themeSettings") || "{}")

      const response = await fetch("/api/profile/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile: profileData,
          links: linksData,
          themeSettings: themeData,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to save profile")
      }

      toast({
        title: "✅ Profile saved to database!",
        description: `Your profile is now available at ${result.shareUrl}`,
        duration: 5000,
      })

      return result
    } catch (error) {
      console.error("Error saving to database:", error)
      toast({
        title: "❌ Database save failed",
        description: error instanceof Error ? error.message : "Failed to save to database",
        variant: "destructive",
        duration: 5000,
      })
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  // Load profile from MongoDB
  const loadFromDatabase = async (userId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/profile/${userId}`)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to load profile")
      }

      const { profile: dbProfile, links, theme } = result.data

      // Update local state and localStorage
      const profileData = {
        name: dbProfile.name,
        bio: dbProfile.bio,
        avatarUrl: dbProfile.avatarUrl,
        secondaryBg: dbProfile.secondaryBg,
        verified: dbProfile.verified,
      }

      // Update the profile state immediately
      setProfile(profileData)

      // Update localStorage
      localStorage.setItem("profileData", JSON.stringify(profileData))
      localStorage.setItem("linksData", JSON.stringify(links))
      localStorage.setItem("themeSettings", JSON.stringify(theme))

      toast({
        title: "✅ Profile loaded!",
        description: "Profile data loaded from database",
        duration: 3000,
      })

      return result.data
    } catch (error) {
      console.error("Error loading from database:", error)
      toast({
        title: "❌ Failed to load profile",
        description: error instanceof Error ? error.message : "Failed to load from database",
        variant: "destructive",
        duration: 5000,
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Check if username is available
  const checkAvailability = async (name: string) => {
    try {
      const response = await fetch("/api/profile/check-availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error("Error checking availability:", error)
      return { available: false, error: "Failed to check availability" }
    }
  }

  // Save profile changes notification (local only)
  const saveProfileChanges = () => {
    localStorage.setItem("profileData", JSON.stringify(profile))
    toast({
      title: "Profile updated locally",
      description: "Your profile has been updated in local storage",
    })
  }

  // Auto-save profile changes whenever profile updates
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("profileData", JSON.stringify(profile))
    }
  }, [profile])

  return {
    profile,
    updateProfile,
    handleProfileChange,
    toggleVerified,
    updateSecondaryBg,
    saveProfileChanges,
    saveToDatabase,
    loadFromDatabase,
    checkAvailability,
    isLoading,
    isSaving,
  }
}
