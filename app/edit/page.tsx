import type { Metadata } from "next"
import EditPage from "@/components/edit-page"

export const metadata: Metadata = {
  title: "Edit Profile - v0.me",
  description: "Customize your v0.me profile, links, and theme",
}

export default function Edit() {
  return <EditPage />
}
