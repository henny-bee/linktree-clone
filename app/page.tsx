// import type { Metadata } from "next"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import Link from "next/link"
// import { LogIn, Sparkles, Users, Zap } from "lucide-react"

// export const metadata: Metadata = {
//   title: "profilsaya.com - Your Personal Link Page",
//   description: "A customizable link sharing platform for all your important links",
// }

// export default function Home() {
//   return (
//     <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
//       <div className="container mx-auto px-4 py-16">
//         <div className="max-w-4xl mx-auto text-center space-y-8">
//           {/* Hero Section */}
//           <div className="space-y-6">
//             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium">
//               <Sparkles className="h-4 w-4" />
//               Create your personalized link page
//             </div>

//             <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
//               profilsaya.com
//             </h1>

//             <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
//               Share all your important links in one beautiful, customizable page. Perfect for social media bios,
//               business cards, and more.
//             </p>
//           </div>

//           {/* CTA Buttons */}
//           <div className="flex justify-center items-center">
//             <Link href="/login">
//               <Button
//                 size="lg"
//                 className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6"
//               >
//                 <LogIn className="h-5 w-5" />
//                 Login
//               </Button>
//             </Link>
//           </div>

//           {/* Features */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
//             <Card className="border-0 shadow-sm bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
//               <CardHeader>
//                 <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 w-fit mx-auto">
//                   <Zap className="h-6 w-6 text-blue-600" />
//                 </div>
//                 <CardTitle>Easy to Use</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-muted-foreground">
//                   Simple, intuitive interface to add your links, customize your profile, and share with the world.
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="border-0 shadow-sm bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
//               <CardHeader>
//                 <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20 w-fit mx-auto">
//                   <Sparkles className="h-6 w-6 text-green-600" />
//                 </div>
//                 <CardTitle>Fully Customizable</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-muted-foreground">
//                   Choose from multiple themes, fonts, colors, and effects to make your page uniquely yours.
//                 </p>
//               </CardContent>
//             </Card>

//             <Card className="border-0 shadow-sm bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
//               <CardHeader>
//                 <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 w-fit mx-auto">
//                   <Users className="h-6 w-6 text-purple-600" />
//                 </div>
//                 <CardTitle>Share Anywhere</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-muted-foreground">
//                   Get a clean, memorable URL that you can share on social media, business cards, or anywhere else.
//                 </p>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </main>
//   )
// }
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Edit, Eye, Sparkles, Users, Zap, ArrowRight, Star, Globe, Palette } from 'lucide-react'

export const metadata: Metadata = {
  title: "profilsaya.com - Your Personal Link Page",
  description: "A customizable link sharing platform for all your important links",
}

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]"></div>
        
        {/* Animated Dots */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-500/40 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-purple-500/40 rounded-full animate-ping delay-500"></div>
        <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-pink-500/40 rounded-full animate-ping delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-100/80 to-purple-100/80 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 animate-bounce-subtle">
              <Sparkles className="h-4 w-4 animate-spin-slow" />
              Create your personalized link page
              <Star className="h-4 w-4 animate-pulse" />
            </div>

            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent animate-gradient-x bg-300% leading-tight">
              profilsaya.com
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-300">
              Share all your important links in one beautiful, customizable page. Perfect for social media bios,
              business cards, and more.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-500">
            <Link href="/edit">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 group"
              >
                <Edit className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                Create Your Page
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/hayden-bleasel">
              
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up delay-700 mt-[85px]">
            <Card className="border-0 shadow-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl hover:bg-white/90 dark:hover:bg-gray-900/90 transition-all duration-500 hover:scale-105 hover:shadow-2xl group">
              <CardHeader className="pb-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 w-fit mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-blue-600 group-hover:animate-pulse" />
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">Easy to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Simple, intuitive interface to add your links, customize your profile, and share with the world.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl hover:bg-white/90 dark:hover:bg-gray-900/90 transition-all duration-500 hover:scale-105 hover:shadow-2xl group delay-100">
              <CardHeader className="pb-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-green-500/20 to-blue-500/20 w-fit mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Palette className="h-8 w-8 text-green-600 group-hover:animate-pulse" />
                </div>
                <CardTitle className="text-xl group-hover:text-green-600 transition-colors">Fully Customizable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Choose from multiple themes, fonts, colors, and effects to make your page uniquely yours.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl hover:bg-white/90 dark:hover:bg-gray-900/90 transition-all duration-500 hover:scale-105 hover:shadow-2xl group delay-200">
              <CardHeader className="pb-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 w-fit mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-purple-600 group-hover:animate-pulse" />
                </div>
                <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">Share Anywhere</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Get a clean, memorable URL that you can share on social media, business cards, or anywhere else.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="mt-20 animate-fade-in-up delay-1000">
            
          </div>
        </div>
      </div>
    </main>
  )
}
