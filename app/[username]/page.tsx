import type { Metadata } from "next"
import LinkTree from "@/components/link-tree"
import { profileService } from "@/lib/profile-service"
import NotFoundPage from "@/components/NotFound"

interface PageProps {
  params: {
    username: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Try to get profile data from database first
  try {
    const profileData = await profileService.getProfile(params.username)
    if (profileData) {
      return {
        title: `${profileData.profile.name} - profilsaya.com`,
        description: profileData.profile.bio || `Check out ${profileData.profile.name}'s links on profilsaya.com`,
      }
    }
  } catch (error) {
    console.error("Error loading profile for metadata:", error)
  }

  // Fallback to username-based metadata
  const displayName = params.username
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return {
    title: `${displayName} - profilsaya.com`,
    description: `Check out ${displayName}'s links on profilsaya.com`,
  }
}

export default async function UserPage({ params }: PageProps) {
  // Use getProfileBySlug for public user lookup
  const profileData = await profileService.getProfileBySlug(params.username)
  if (!profileData) {
    return <NotFoundPage />
  }
  return <LinkTree username={params.username} />
}
