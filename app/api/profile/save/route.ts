import { type NextRequest, NextResponse } from "next/server"
import { profileService } from "@/lib/profile-service"
import { authService } from "@/lib/auth-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { profile, links, themeSettings, token } = body

    console.log("Save profile request received:", { profile, links: links?.length, themeSettings, hasToken: !!token })

    // Validate token
    if (!token) {
      return NextResponse.json({ error: "Authentication token required" }, { status: 401 })
    }

    // Verify token and get user
    let decoded
    let user
    try {
      decoded = await authService.verifyToken(token)
      console.log("[save/route] decoded.userId:", decoded.userId, "type:", typeof decoded.userId)
      user = await authService.getUserById(decoded.userId)
    } catch (error) {
      console.error("Token verification failed:", error)
      return NextResponse.json({ error: "Invalid authentication token" }, { status: 401 })
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    console.log("User authenticated:", user.displayName, user._id)

    // Validate required data
    if (!profile || !profile.name) {
      return NextResponse.json({ error: "Profile name is required" }, { status: 400 })
    }

    // Ensure we have valid data structures
    const profileData = {
      name: profile.name || user.displayName,
      bio: profile.bio || "",
      avatarUrl: profile.avatarUrl || "",
      verified: profile.verified || false,
      secondaryBg: profile.secondaryBg || "bg-secondary",
    }

    const linksData = Array.isArray(links) ? links : []

    const themeData = {
      colorTheme: themeSettings?.colorTheme || "default",
      gradient: themeSettings?.gradient || "none",
      pattern: themeSettings?.pattern || "none",
      patternColor: themeSettings?.patternColor || "#000000",
      font: themeSettings?.font || "font-sans",
      fontColors: themeSettings?.fontColors || {
        displayName: "#000000",
        bio: "#6b7280",
        linkTitle: "#000000",
        linkUrl: "#6b7280",
      },
      buttonStyle: themeSettings?.buttonStyle || "default",
      borderRadius: themeSettings?.borderRadius || "rounded-lg",
      backgroundColor: themeSettings?.backgroundColor || "bg-secondary",
      backgroundGradient: themeSettings?.backgroundGradient || "none",
      backgroundImage: themeSettings?.backgroundImage || "",
      effects: themeSettings?.effects || {
        shadow: true,
        glassmorphism: false,
        glassmorphismOpacity: 0.1,
        cardOpacity: 1,
        animationSpeed: 400,
        blurGlass: false,
        blurIntensity: 10,
      },
    }

    console.log("Saving profile data:", { profileData, linksCount: linksData.length, themeData })

    // Save to MongoDB with user ID
    const userId = await profileService.saveProfile(user._id!.toString(), profileData, linksData, themeData)

    console.log("Profile saved successfully for user:", userId)

    // Generate shareable URL using user's slug
    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/${user.slug}`

    return NextResponse.json({
      success: true,
      userId,
      shareUrl,
      slug: user.slug,
      message: "Profile saved successfully",
    })
  } catch (error) {
    console.error("Error in save profile API:", error)
    return NextResponse.json(
      {
        error: "Failed to save profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
