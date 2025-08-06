import type { Metadata } from "next"
import LoginForm from "@/components/login-form"

export const metadata: Metadata = {
  title: "Login - profilsaya.com",
  description: "Login or register to create your personalized link page",
}

export default function LoginPage() {
  return <LoginForm />
}
