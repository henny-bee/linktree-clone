import type { NextRequest } from "next/server"
import { authService } from "./auth-service"

export async function getAuthenticatedUser(request: NextRequest) {
  try {
    // Try to get token from Authorization header first
    const authHeader = request.headers.get("authorization")
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7)
      const decoded = await authService.verifyToken(token)
      const user = await authService.getUserById(decoded.userId)
      return user
    }

    // If no auth header, try to get from body (for client-side requests)
    const body = await request.json()
    if (body.token) {
      const decoded = await authService.verifyToken(body.token)
      const user = await authService.getUserById(decoded.userId)
      return user
    }

    return null
  } catch (error) {
    console.error("Auth middleware error:", error)
    return null
  }
}
