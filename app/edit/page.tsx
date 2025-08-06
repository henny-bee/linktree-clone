import type { Metadata } from "next"
import EditPage from "@/components/edit-page"

export const metadata: Metadata = {
  title: "Edit Profile - profilsaya.com",
  description: "Customize your profilsaya.com profile, links, and theme",
}

export default function Edit() {
  return <EditPage />
}
