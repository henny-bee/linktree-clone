import { type NextRequest, NextResponse } from "next/server"
import { profileService } from "@/lib/profile-service"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    console.log("Fetching profile for:", userId)

    let profileData

    // Check if userId is actually a slug (contains letters/hyphens)
    if (userId.includes("-") || /[a-zA-Z]/.test(userId)) {
      console.log("Treating as slug:", userId)
      // It's a slug, get profile by slug
      profileData = await profileService.getProfileBySlug(userId)
    } else {
      console.log("Treating as user ID:", userId)
      // It's a user ID, get profile by ID
      profileData = await profileService.getProfile(userId)
    }

    if (!profileData) {
      console.log("Profile not found for:", userId)
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    console.log("Profile found:", profileData.profile.name)

    return NextResponse.json({
      success: true,
      data: profileData,
    })
  } catch (error) {
    console.error("Error in get profile API:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const { userId } = params

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Delete profile from MongoDB
    const success = await profileService.deleteProfile(userId)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete profile" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Profile deleted successfully",
    })
  } catch (error) {
    console.error("Error in delete profile API:", error)
    return NextResponse.json({ error: "Failed to delete profile" }, { status: 500 })
  }
}
