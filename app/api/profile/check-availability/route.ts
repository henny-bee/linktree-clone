import { type NextRequest, NextResponse } from "next/server"
import { profileService } from "@/lib/profile-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    // Generate userId from name
    const userId = name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")

    // Check availability
    const isAvailable = await profileService.isUserIdAvailable(userId)

    return NextResponse.json({
      success: true,
      userId,
      available: isAvailable,
    })
  } catch (error) {
    console.error("Error checking availability:", error)
    return NextResponse.json({ error: "Failed to check availability" }, { status: 500 })
  }
}
