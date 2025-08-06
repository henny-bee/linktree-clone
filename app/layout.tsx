import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import {
  Inter,
  Merriweather,
  JetBrains_Mono,
  Playfair_Display,
  Open_Sans,
  Roboto_Slab,
  Poppins,
  Source_Code_Pro,
} from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeSettingsProvider } from "@/hooks/use-theme-settings"
import { Toaster } from "@/components/ui/toaster"

// Load fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-serif",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-slab",
  display: "swap",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rounded",
  display: "swap",
})

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-code",
  display: "swap",
})

export const metadata: Metadata = {
  title: "profilsaya.com",
  description: "Your personal link sharing platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="font-sans">
      <body
        className={`${inter.variable} ${merriweather.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable} ${openSans.variable} ${robotoSlab.variable} ${poppins.variable} ${sourceCodePro.variable}`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ThemeSettingsProvider>
            {children}
            <Toaster />
          </ThemeSettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
