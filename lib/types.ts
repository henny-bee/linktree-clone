import { ObjectId } from "mongodb"

export interface ProfileData {
  _id?: string
  userId: string
  name: string
  bio: string
  avatarUrl: string
  verified: boolean
  secondaryBg: string
  createdAt: Date
  updatedAt: Date
}

export interface LinkData {
  _id?: string
  userId: string
  id: string
  title: string
  url: string
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface ThemeData {
  _id?: string
  userId: string
  colorTheme: string
  gradient: string
  pattern: string
  patternColor: string
  font: string
  fontColors: {
    displayName: string
    bio: string
    linkTitle: string
    linkUrl: string
  }
  buttonStyle: string
  borderRadius: string
  backgroundColor: string
  backgroundGradient: string
  backgroundImage: string
  effects: {
    shadow: boolean
    glassmorphism: boolean
    glassmorphismOpacity: number
    cardOpacity: number
    animationSpeed: number
    blurGlass: boolean
    blurIntensity: number
  }
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile {
  profile: ProfileData
  links: LinkData[]
  theme: ThemeData
}

// New User Authentication Types
export interface User {
  _id?: string | ObjectId
  displayName: string
  email: string
  password: string
  slug: string // URL-friendly version of displayName
  createdAt: Date
  updatedAt: Date
}

export interface AuthResponse {
  success: boolean
  user: Omit<User, "password">
  token: string
}
