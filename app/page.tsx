import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { LogIn, Sparkles, Users, Zap } from "lucide-react"

export const metadata: Metadata = {
  title: "v0.me - Your Personal Link Page",
  description: "A customizable link sharing platform for all your important links",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Create your personalized link page
            </div>

            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
              v0.me
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Share all your important links in one beautiful, customizable page. Perfect for social media bios,
              business cards, and more.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex justify-center items-center">
            <Link href="/login">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6"
              >
                <LogIn className="h-5 w-5" />
                Login
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <Card className="border-0 shadow-sm bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
              <CardHeader>
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 w-fit mx-auto">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Easy to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Simple, intuitive interface to add your links, customize your profile, and share with the world.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
              <CardHeader>
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20 w-fit mx-auto">
                  <Sparkles className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Fully Customizable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Choose from multiple themes, fonts, colors, and effects to make your page uniquely yours.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
              <CardHeader>
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 w-fit mx-auto">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Share Anywhere</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get a clean, memorable URL that you can share on social media, business cards, or anywhere else.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
