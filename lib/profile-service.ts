import { getDatabase } from "./mongodb"
import type { ProfileData, LinkData, ThemeData, UserProfile } from "./types"

export class ProfileService {
  private async getDb() {
    return await getDatabase()
  }

  // Save complete profile data for authenticated user
  async saveProfile(userId: string, profileData: any, linksData: any[], themeData: any): Promise<string> {
    const { db, client } = await this.getDb()
    const now = new Date()

    try {
      // Start a transaction for data consistency
      const session = client.startSession()

      await session.withTransaction(async () => {
        // Save profile
        const profileCollection = db.collection<ProfileData>("profiles")
        await profileCollection.replaceOne(
          { userId },
          {
            userId,
            name: profileData.name,
            bio: profileData.bio,
            avatarUrl: profileData.avatarUrl,
            verified: profileData.verified,
            secondaryBg: profileData.secondaryBg,
            createdAt: now,
            updatedAt: now,
          },
          { upsert: true, session },
        )

        // Save links (delete existing and insert new ones)
        const linksCollection = db.collection<LinkData>("links")
        await linksCollection.deleteMany({ userId }, { session })

        if (linksData.length > 0) {
          const linksToInsert = linksData.map((link, index) => ({
            userId,
            id: link.id,
            title: link.title,
            url: link.url,
            order: index,
            createdAt: now,
            updatedAt: now,
          }))
          await linksCollection.insertMany(linksToInsert, { session })
        }

        // Save theme
        const themeCollection = db.collection<ThemeData>("themes")
        await themeCollection.replaceOne(
          { userId },
          {
            userId,
            colorTheme: themeData.colorTheme,
            gradient: themeData.gradient,
            pattern: themeData.pattern,
            patternColor: themeData.patternColor,
            font: themeData.font,
            fontColors: themeData.fontColors,
            buttonStyle: themeData.buttonStyle,
            borderRadius: themeData.borderRadius,
            backgroundColor: themeData.backgroundColor,
            backgroundGradient: themeData.backgroundGradient,
            backgroundImage: themeData.backgroundImage,
            effects: themeData.effects,
            createdAt: now,
            updatedAt: now,
          },
          { upsert: true, session },
        )
      })

      await session.endSession()
      return userId
    } catch (error) {
      console.error("Error saving profile:", error)
      throw new Error("Failed to save profile data")
    }
  }

  // Get complete profile data by userId
  async getProfile(userId: string): Promise<UserProfile | null> {
    const { db } = await this.getDb()

    try {
      const [profile, links, theme] = await Promise.all([
        db.collection<ProfileData>("profiles").findOne({ userId }),
        db.collection<LinkData>("links").find({ userId }).sort({ order: 1 }).toArray(),
        db.collection<ThemeData>("themes").findOne({ userId }),
      ])

      if (!profile) {
        return null
      }

      return {
        profile,
        links,
        theme: theme || this.getDefaultTheme(userId),
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      throw new Error("Failed to fetch profile data")
    }
  }

  // Get profile by user slug (for public pages)
  async getProfileBySlug(slug: string): Promise<UserProfile | null> {
    const { db } = await this.getDb()

    try {
      // First get the user by slug
      const user = await db.collection("users").findOne({ slug })
      if (!user) {
        return null
      }

      const userId = user._id.toString()

      // Then get their profile data
      return await this.getProfile(userId)
    } catch (error) {
      console.error("Error fetching profile by slug:", error)
      throw new Error("Failed to fetch profile data")
    }
  }

  // Get all profiles (for listing/discovery)
  async getAllProfiles(limit = 50): Promise<ProfileData[]> {
    const { db } = await this.getDb()

    try {
      return await db.collection<ProfileData>("profiles").find({}).sort({ updatedAt: -1 }).limit(limit).toArray()
    } catch (error) {
      console.error("Error fetching profiles:", error)
      throw new Error("Failed to fetch profiles")
    }
  }

  // Delete profile and all associated data
  async deleteProfile(userId: string): Promise<boolean> {
    const { db, client } = await this.getDb()

    try {
      const session = client.startSession()

      await session.withTransaction(async () => {
        await Promise.all([
          db.collection("profiles").deleteOne({ userId }, { session }),
          db.collection("links").deleteMany({ userId }, { session }),
          db.collection("themes").deleteOne({ userId }, { session }),
        ])
      })

      await session.endSession()
      return true
    } catch (error) {
      console.error("Error deleting profile:", error)
      throw new Error("Failed to delete profile")
    }
  }

  // Get default theme data
  private getDefaultTheme(userId: string): ThemeData {
    return {
      userId,
      colorTheme: "default",
      gradient: "none",
      pattern: "none",
      patternColor: "#000000",
      font: "font-sans",
      fontColors: {
        displayName: "#000000",
        bio: "#6b7280",
        linkTitle: "#000000",
        linkUrl: "#6b7280",
      },
      buttonStyle: "default",
      borderRadius: "rounded-lg",
      backgroundColor: "bg-secondary",
      backgroundGradient: "none",
      backgroundImage: "",
      effects: {
        shadow: true,
        glassmorphism: false,
        glassmorphismOpacity: 0.1,
        cardOpacity: 1,
        animationSpeed: 400,
        blurGlass: false,
        blurIntensity: 10,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
  // Check if a userId is available (not taken)
  async isUserIdAvailable(userId: string): Promise<boolean> {
    const { db } = await this.getDb();
    const existing = await db.collection("profiles").findOne({ userId });
    return !existing;
  }
}

// Export singleton instance
export const profileService = new ProfileService()
