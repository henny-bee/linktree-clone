import { getDatabase } from "./mongodb"
import { ObjectId } from "mongodb"
import type { User, AuthResponse } from "./types"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export class AuthService {
  private async getDb() {
    return await getDatabase()
  }

  // Generate URL-friendly slug from display name
  private generateSlug(displayName: string): string {
    return displayName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
  }

  // Register new user
  async register(displayName: string, email: string, password: string): Promise<AuthResponse> {
    const { db } = await this.getDb()
    const usersCollection = db.collection<User>("users")

    try {
      // Check if email already exists
      const existingUser = await usersCollection.findOne({ email: email.toLowerCase() })
      if (existingUser) {
        throw new Error("Email already registered")
      }

      // Generate slug and check if it's available
      const slug = this.generateSlug(displayName)
      const existingSlug = await usersCollection.findOne({ slug })
      if (existingSlug) {
        throw new Error("Display name already taken. Please choose a different name.")
      }

      // Hash password
      const saltRounds = 12
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      // Create user
      const now = new Date()
      const newUser: User = {
        displayName,
        email: email.toLowerCase(),
        password: hashedPassword,
        slug,
        createdAt: now,
        updatedAt: now,
      }

      const result = await usersCollection.insertOne(newUser)
      const userId = result.insertedId.toString()

      // Generate JWT token
      const token = jwt.sign(
        { userId, email: newUser.email, displayName: newUser.displayName },
        process.env.JWT_SECRET || "fallback-secret",
        { expiresIn: "7d" },
      )

      // Return user without password
      const userResponse = {
        _id: userId,
        displayName: newUser.displayName,
        email: newUser.email,
        slug: newUser.slug,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      }

      return {
        success: true,
        user: userResponse,
        token,
      }
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  }

  // Login user
  async login(email: string, password: string): Promise<AuthResponse> {
    const { db } = await this.getDb()
    const usersCollection = db.collection<User>("users")

    try {
      // Find user by email
      const user = await usersCollection.findOne({ email: email.toLowerCase() })
      if (!user) {
        throw new Error("Invalid email or password")
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        throw new Error("Invalid email or password")
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id?.toString(), email: user.email, displayName: user.displayName },
        process.env.JWT_SECRET || "fallback-secret",
        { expiresIn: "7d" },
      )

      // Return user without password
      const userResponse = {
        _id: user._id?.toString(),
        displayName: user.displayName,
        email: user.email,
        slug: user.slug,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }

      return {
        success: true,
        user: userResponse,
        token,
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  // Verify JWT token
  async verifyToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret")
      return decoded
    } catch (error) {
      throw new Error("Invalid token")
    }
  }

  // Get user by ID
  async getUserById(userId: string): Promise<Omit<User, "password"> | null> {
    const { db } = await this.getDb()
    const usersCollection = db.collection<User>("users")

    try {
      console.log("[authService.getUserById] userId:", userId, "type:", typeof userId)
      let objectId
      try {
        objectId = new ObjectId(userId)
      } catch (e) {
        console.error("[authService.getUserById] Invalid ObjectId:", userId)
        return null
      }
      const user = await usersCollection.findOne({ _id: objectId })
      console.log("[authService.getUserById] user found:", !!user, user?._id)
      if (!user) {
        return null
      }

      // Return user without password
      return {
        _id: user._id?.toString(),
        displayName: user.displayName,
        email: user.email,
        slug: user.slug,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    } catch (error) {
      console.error("Get user error:", error)
      return null
    }
  }

  // Get user by slug
  async getUserBySlug(slug: string): Promise<Omit<User, "password"> | null> {
    const { db } = await this.getDb()
    const usersCollection = db.collection<User>("users")

    try {
      const user = await usersCollection.findOne({ slug })
      if (!user) {
        return null
      }

      // Return user without password
      return {
        _id: user._id?.toString(),
        displayName: user.displayName,
        email: user.email,
        slug: user.slug,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    } catch (error) {
      console.error("Get user by slug error:", error)
      return null
    }
  }
}

// Export singleton instance
export const authService = new AuthService()
