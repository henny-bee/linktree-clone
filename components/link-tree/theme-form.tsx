"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { useThemeSettings } from "@/hooks/use-theme-settings"
import { useToast } from "@/hooks/use-toast"
import type { Profile } from "@/hooks/use-profile"
import {
  Moon,
  Sun,
  Palette,
  Sparkles,
  Share2,
  Copy,
  LinkIcon,
  Type,
  Layout,
  Paintbrush,
  Settings,
  Zap,
  Layers,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { LinkItemProps } from "@/components/link-item"
import { ColorPicker } from "@/components/ui/color-picker"

interface ThemeFormProps {
  profile: Profile
  links?: LinkItemProps[]
  onUpdateSecondaryBg: (bgColor: string) => void
  currentTheme?: string
  onThemeChange: (theme: string) => void
}

// Enhanced color themes
const colorThemes = [
  { name: "Default", value: "default", primaryColor: "#000000", secondaryColor: "#f1f5f9" },
  { name: "Rose", value: "rose", primaryColor: "#e11d48", secondaryColor: "#fff1f2" },
  { name: "Green", value: "green", primaryColor: "#10b981", secondaryColor: "#ecfdf5" },
  { name: "Purple", value: "purple", primaryColor: "#8b5cf6", secondaryColor: "#f5f3ff" },
  { name: "Orange", value: "orange", primaryColor: "#f97316", secondaryColor: "#fff7ed" },
  { name: "Blue", value: "blue", primaryColor: "#3b82f6", secondaryColor: "#eff6ff" },
  { name: "Teal", value: "teal", primaryColor: "#14b8a6", secondaryColor: "#f0fdfa" },
  { name: "Pink", value: "pink", primaryColor: "#ec4899", secondaryColor: "#fdf2f8" },
]

// Font color presets
const fontColorPresets = [
  { name: "Black", value: "#000000", color: "#000000" },
  { name: "Dark Gray", value: "#374151", color: "#374151" },
  { name: "Medium Gray", value: "#6b7280", color: "#6b7280" },
  { name: "Light Gray", value: "#9ca3af", color: "#9ca3af" },
  { name: "Blue", value: "#1e40af", color: "#1e40af" },
  { name: "Green", value: "#166534", color: "#166534" },
  { name: "Purple", value: "#581c87", color: "#581c87" },
  { name: "Red", value: "#991b1b", color: "#991b1b" },
  { name: "Orange", value: "#ea580c", color: "#ea580c" },
  { name: "Pink", value: "#be185d", color: "#be185d" },
  { name: "Teal", value: "#0f766e", color: "#0f766e" },
  { name: "White", value: "#ffffff", color: "#ffffff" },
]

// Pattern color presets
const patternColorPresets = [
  { name: "Black", value: "#000000", color: "#000000" },
  { name: "Gray", value: "#6b7280", color: "#6b7280" },
  { name: "White", value: "#ffffff", color: "#ffffff" },
  { name: "Blue", value: "#3b82f6", color: "#3b82f6" },
  { name: "Green", value: "#10b981", color: "#10b981" },
  { name: "Purple", value: "#8b5cf6", color: "#8b5cf6" },
  { name: "Red", value: "#ef4444", color: "#ef4444" },
  { name: "Orange", value: "#f97316", color: "#f97316" },
  { name: "Yellow", value: "#eab308", color: "#eab308" },
  { name: "Pink", value: "#ec4899", color: "#ec4899" },
  { name: "Teal", value: "#14b8a6", color: "#14b8a6" },
  { name: "Indigo", value: "#6366f1", color: "#6366f1" },
]

// Enhanced background colors with RGB values
const backgroundColors = [
  { name: "White", value: "bg-white", color: "#ffffff", rgb: "255, 255, 255" },
  { name: "Light Gray", value: "bg-gray-50", color: "#f9fafb", rgb: "249, 250, 251" },
  { name: "Slate", value: "bg-slate-100", color: "#f1f5f9", rgb: "241, 245, 249" },
  { name: "Red", value: "bg-red-50", color: "#fef2f2", rgb: "254, 242, 242" },
  { name: "Orange", value: "bg-orange-50", color: "#fff7ed", rgb: "255, 247, 237" },
  { name: "Yellow", value: "bg-yellow-50", color: "#fefce8", rgb: "254, 252, 232" },
  { name: "Green", value: "bg-green-50", color: "#f0fdf4", rgb: "240, 253, 244" },
  { name: "Blue", value: "bg-blue-50", color: "#eff6ff", rgb: "239, 246, 255" },
  { name: "Purple", value: "bg-purple-50", color: "#faf5ff", rgb: "250, 245, 255" },
  { name: "Pink", value: "bg-pink-50", color: "#fdf2f8", rgb: "253, 242, 248" },
]

// Enhanced background gradients
const backgroundGradients = [
  { name: "None", value: "none", preview: "transparent" },
  { name: "Sunset", value: "sunset", preview: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)" },
  { name: "Ocean", value: "ocean", preview: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "Forest", value: "forest", preview: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)" },
  { name: "Midnight", value: "midnight", preview: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)" },
  { name: "Aurora", value: "aurora", preview: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)" },
  { name: "Fire", value: "fire", preview: "linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%)" },
  { name: "Purple Dream", value: "purple", preview: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "Pink Bliss", value: "pink", preview: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { name: "Neon Cyber", value: "neon", preview: "linear-gradient(135deg, #00f5ff 0%, #ff00ff 50%, #ffff00 100%)" },
  { name: "Tropical", value: "tropical", preview: "linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffe66d 100%)" },
  { name: "Galaxy", value: "galaxy", preview: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" },
]

// Enhanced patterns
const backgroundPatterns = [
  { name: "None", value: "pattern-none", description: "Clean, no pattern" },
  { name: "Dots", value: "pattern-dots", description: "Subtle dotted pattern" },
  { name: "Grid", value: "pattern-grid", description: "Clean grid lines" },
  { name: "Stripes", value: "pattern-stripes", description: "Diagonal stripes" },
  { name: "Waves", value: "pattern-waves", description: "Wave-like pattern" },
  { name: "Hexagons", value: "pattern-hexagons", description: "Hexagonal pattern" },
]

// Enhanced font options with more typography
const fontOptions = [
  {
    name: "Inter",
    value: "font-sans",
    description: "Modern sans-serif",
    sample: "The quick brown fox jumps over the lazy dog.",
    family: "Inter",
  },
  {
    name: "Merriweather",
    value: "font-serif",
    description: "Elegant serif",
    sample: "The quick brown fox jumps over the lazy dog.",
    family: "Merriweather",
  },
  {
    name: "JetBrains Mono",
    value: "font-mono",
    description: "Monospace coding font",
    sample: "The quick brown fox jumps over the lazy dog.",
    family: "JetBrains Mono",
  },
  {
    name: "Playfair Display",
    value: "font-display",
    description: "Dramatic serif display",
    sample: "The quick brown fox jumps over the lazy dog.",
    family: "Playfair Display",
  },
  {
    name: "Open Sans",
    value: "font-body",
    description: "Friendly sans-serif",
    sample: "The quick brown fox jumps over the lazy dog.",
    family: "Open Sans",
  },
  {
    name: "Roboto Slab",
    value: "font-slab",
    description: "Modern slab serif",
    sample: "The quick brown fox jumps over the lazy dog.",
    family: "Roboto Slab",
  },
  {
    name: "Poppins",
    value: "font-rounded",
    description: "Geometric rounded",
    sample: "The quick brown fox jumps over the lazy dog.",
    family: "Poppins",
  },
  {
    name: "Source Code Pro",
    value: "font-code",
    description: "Clean coding font",
    sample: "The quick brown fox jumps over the lazy dog.",
    family: "Source Code Pro",
  },
]

// Button style options
const buttonStyles = [
  {
    name: "Default",
    value: "default",
    description: "Standard rounded buttons",
    preview: "bg-primary text-primary-foreground rounded-lg",
  },
  {
    name: "Sharp",
    value: "sharp",
    description: "Sharp rectangular buttons",
    preview: "bg-primary text-primary-foreground rounded-none",
  },
  {
    name: "Rounded",
    value: "rounded",
    description: "Fully rounded pill buttons",
    preview: "bg-primary text-primary-foreground rounded-full",
  },
  {
    name: "Outlined",
    value: "outlined",
    description: "Transparent with borders",
    preview: "border-2 border-primary text-primary bg-transparent rounded-lg",
  },
  {
    name: "Minimal",
    value: "minimal",
    description: "Text-only minimal style",
    preview: "text-primary bg-transparent underline",
  },
  {
    name: "Gradient",
    value: "gradient",
    description: "Gradient background",
    preview: "bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg",
  },
  {
    name: "Soft",
    value: "soft",
    description: "Soft background style",
    preview: "bg-primary/10 text-primary rounded-lg",
  },
  {
    name: "Glass",
    value: "glass",
    description: "Glassmorphism effect",
    preview: "bg-white/20 backdrop-blur-sm border border-white/30 text-foreground rounded-lg",
  },
]

// Font color types
const fontColorTypes = [
  { key: "displayName", label: "Display Name", description: "Your profile name" },
  { key: "bio", label: "Bio Text", description: "Your bio description" },
  { key: "linkTitle", label: "Link Title Text", description: "Link button text color" },
]

// Update the component signature
export function ThemeForm({ profile, links = [], onUpdateSecondaryBg, currentTheme, onThemeChange }: ThemeFormProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("colors")
  const [shareUrl, setShareUrl] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const {
    themeSettings,
    updateColorTheme,
    updatePattern,
    updatePatternColor,
    updateFont,
    updateFontColors,
    updateButtonStyle,
    updateBorderRadius,
    updateBackgroundColor,
    updateBackgroundGradient,
    updateBackgroundImage,
    updateCardOpacity,
    updateAnimationSpeed,
    updateGlassmorphismOpacity,
    updateBlurIntensity,
    toggleShadow,
    toggleGlassmorphism,
    toggleBlurGlass,
    resetToDefaults,
  } = useThemeSettings()

  const isDarkMode = currentTheme === "dark"

  const handleDarkModeToggle = () => {
    const newTheme = isDarkMode ? "light" : "dark"
    onThemeChange(newTheme)
    toast({
      title: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode activated`,
      description: `Switched to ${newTheme} mode`,
    })
  }

  const handleResetDefaults = () => {
    resetToDefaults()
    toast({
      title: "Theme reset",
      description: "All theme settings have been reset to defaults",
    })
  }

  // Enhanced save and share functionality with MongoDB integration
  const handleSaveAndShare = async () => {
    try {
      // Force save all current data to localStorage first
      const profileData = JSON.parse(localStorage.getItem("profileData") || JSON.stringify(profile))
      const linksData = JSON.parse(localStorage.getItem("linksData") || JSON.stringify(links))
      const themeData = JSON.parse(localStorage.getItem("themeSettings") || JSON.stringify(themeSettings))

      // Save to MongoDB
      const response = await fetch("/api/profile/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile: profileData,
          links: linksData,
          themeSettings: themeData,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to save profile")
      }

      setShareUrl(result.shareUrl)

      // Copy to clipboard if available
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(result.shareUrl)
          .then(() => {
            toast({
              title: "🎉 Profile saved to database & shared!",
              description: `Your v0.me/${result.userId} link has been copied to clipboard`,
              duration: 5000,
            })
          })
          .catch(() => {
            toast({
              title: "✅ Profile saved to database!",
              description: `Your profile is now live at v0.me/${result.userId}`,
              duration: 5000,
            })
          })
      } else {
        toast({
          title: "✅ Profile saved to database!",
          description: `Your profile is now live at v0.me/${result.userId}`,
          duration: 5000,
        })
      }

      console.log("Saved to database:", result)
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "❌ Error",
        description: error instanceof Error ? error.message : "Failed to save profile to database",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  const handlePreview = () => {
    setShowPreview(!showPreview)
    toast({
      title: showPreview ? "Preview closed" : "Preview mode",
      description: showPreview ? "Back to edit mode" : "Viewing your page as visitors will see it",
    })
  }

  const handleCopyUrl = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          toast({
            title: "Copied!",
            description: "Link copied to clipboard",
          })
        })
        .catch(() => {
          toast({
            title: "Copy failed",
            description: "Please copy the link manually",
          })
        })
    } else {
      toast({
        title: "Copy not supported",
        description: "Please copy the link manually",
      })
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
              <Palette className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            Theme Studio
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">Craft your perfect v0.me experience</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            size="sm"
            onClick={handleSaveAndShare}
            className="gap-2 bg-gradient-to-r from-primary to-primary/80 flex-1 sm:flex-none"
          >
            <Share2 className="h-4 w-4" />
            Save & Share
          </Button>
        </div>
      </div>

      {/* Share URL Display */}
      {shareUrl && (
        <Card className="border-dashed border-2 border-primary/20 bg-primary/5">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                <LinkIcon className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1 w-full">
                <p className="text-sm font-medium text-primary mb-2">Your shareable link is ready!</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="text-xs bg-transparent border-primary/20 text-muted-foreground flex-1"
                  />
                  <Button variant="ghost" size="sm" onClick={handleCopyUrl} className="w-full sm:w-auto">
                    <Copy className="h-4 w-4 mr-2 sm:mr-0" />
                    <span className="sm:hidden">Copy Link</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dark Mode Toggle */}
      <Card className="overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                {isDarkMode ? (
                  <Moon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                ) : (
                  <Sun className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                )}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold">{isDarkMode ? "Dark Mode" : "Light Mode"}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {isDarkMode ? "Dark theme is active" : "Light theme is active"}
                </p>
              </div>
            </div>
            <Switch
              checked={isDarkMode}
              onCheckedChange={handleDarkModeToggle}
              className="data-[state=checked]:bg-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs - Mobile Responsive */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 h-12 sm:h-14 p-1 sm:p-1.5 bg-gradient-to-r from-muted/30 to-muted/50 rounded-xl border shadow-sm">
          <TabsTrigger
            value="colors"
            className="gap-1 sm:gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all duration-200 hover:bg-background/50 text-xs sm:text-sm"
          >
            <Paintbrush className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Colors</span>
            <span className="sm:hidden">Color</span>
          </TabsTrigger>
          <TabsTrigger
            value="background"
            className="gap-1 sm:gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all duration-200 hover:bg-background/50 text-xs sm:text-sm"
          >
            <Layout className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Background</span>
            <span className="sm:hidden">BG</span>
          </TabsTrigger>
          <TabsTrigger
            value="typography"
            className="gap-1 sm:gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all duration-200 hover:bg-background/50 text-xs sm:text-sm"
          >
            <Type className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Typography</span>
            <span className="sm:hidden">Font</span>
          </TabsTrigger>
          <TabsTrigger
            value="components"
            className="gap-1 sm:gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all duration-200 hover:bg-background/50 text-xs sm:text-sm hidden sm:flex"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Components</span>
          </TabsTrigger>
          <TabsTrigger
            value="effects"
            className="gap-1 sm:gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg transition-all duration-200 hover:bg-background/50 text-xs sm:text-sm hidden sm:flex"
          >
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Effects</span>
          </TabsTrigger>
        </TabsList>

        {/* Colors Tab */}
        <TabsContent value="colors" className="space-y-6 sm:space-y-8 mt-6 sm:mt-8">
          {/* Color Theme */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Palette className="h-4 w-4 sm:h-5 sm:w-5" />
                Color Theme
              </CardTitle>
              <CardDescription className="text-sm">Choose your primary color scheme</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={themeSettings.colorTheme}
                onValueChange={updateColorTheme}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
              >
                {colorThemes.map((colorTheme) => (
                  <div key={colorTheme.value}>
                    <RadioGroupItem value={colorTheme.value} id={`theme-${colorTheme.value}`} className="sr-only" />
                    <Label
                      htmlFor={`theme-${colorTheme.value}`}
                      className={cn(
                        "flex flex-col items-center justify-center rounded-xl border-2 p-3 sm:p-4 hover:border-primary/50 transition-all duration-200 cursor-pointer group touch-manipulation",
                        themeSettings.colorTheme === colorTheme.value &&
                          "border-primary ring-2 ring-primary/20 bg-primary/5",
                      )}
                    >
                      <div className="flex gap-1 mb-2 sm:mb-3">
                        <div
                          className="w-5 h-8 sm:w-6 sm:h-10 rounded-l-lg shadow-sm group-hover:scale-105 transition-transform"
                          style={{ backgroundColor: colorTheme.primaryColor }}
                        />
                        <div
                          className="w-5 h-8 sm:w-6 sm:h-10 rounded-r-lg shadow-sm group-hover:scale-105 transition-transform"
                          style={{ backgroundColor: colorTheme.secondaryColor }}
                        />
                      </div>
                      <span className="text-xs sm:text-sm font-medium">{colorTheme.name}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Font Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Type className="h-4 w-4 sm:h-5 sm:w-5" />
                Font Colors
              </CardTitle>
              <CardDescription className="text-sm">Customize colors for different text elements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {fontColorTypes.map((fontType) => (
                <div key={fontType.key} className="space-y-3">
                  <div>
                    <Label className="text-sm sm:text-base font-medium">{fontType.label}</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">{fontType.description}</p>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3">
                    {fontColorPresets.map((color) => (
                      <button
                        key={`${fontType.key}-${color.value}`}
                        type="button"
                        className={cn(
                          "relative flex flex-col items-center p-2 sm:p-3 rounded-lg border-2 hover:border-primary/50 transition-all duration-200 group touch-manipulation",
                          themeSettings.fontColors?.[fontType.key as keyof typeof themeSettings.fontColors] ===
                            color.value && "border-primary ring-2 ring-primary/20 bg-primary/5",
                        )}
                        onClick={() =>
                          updateFontColors(fontType.key as keyof typeof themeSettings.fontColors, color.value)
                        }
                        title={color.name}
                      >
                        <div
                          className="w-4 h-4 sm:w-6 sm:h-6 rounded-full shadow-sm mb-1 sm:mb-2 group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: color.color }}
                        />
                        <span className="text-xs font-medium">{color.name}</span>
                        {themeSettings.fontColors?.[fontType.key as keyof typeof themeSettings.fontColors] ===
                          color.value && (
                          <div className="absolute -top-1 -right-1">
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full border-2 border-background"></div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {fontType.key !== "linkTitle" && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Background Tab */}
        <TabsContent value="background" className="space-y-6 sm:space-y-8 mt-6 sm:mt-8">
          {/* Background Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Background Color</CardTitle>
              <CardDescription className="text-sm">Select or customize your background color</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Preset Colors */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Quick Presets</Label>
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 sm:gap-3">
                  {backgroundColors.map((bgColor) => (
                    <button
                      key={bgColor.value}
                      type="button"
                      className={cn(
                        "h-12 sm:h-16 rounded-lg border-2 hover:border-primary/50 transition-all duration-200 relative overflow-hidden group touch-manipulation",
                        themeSettings.backgroundColor === bgColor.value && "border-primary ring-2 ring-primary/20",
                      )}
                      style={{ backgroundColor: bgColor.color }}
                      onClick={() => updateBackgroundColor(bgColor.value)}
                      title={`${bgColor.name} (RGB: ${bgColor.rgb})`}
                    >
                      <span className="sr-only">{bgColor.name}</span>
                      {themeSettings.backgroundColor === bgColor.value && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full border-2 border-background"></div>
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {bgColor.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom RGB Color Picker */}
              <div className="pt-4 border-t">
                <ColorPicker
                  label="Custom Background Color"
                  value={
                    themeSettings.backgroundColor?.startsWith("custom-")
                      ? themeSettings.backgroundColor.replace("custom-", "")
                      : "#ffffff"
                  }
                  onChange={(color) => {
                    // Update theme settings with custom color
                    updateBackgroundColor(`custom-${color}`)
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Background Gradients */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Background Gradient</CardTitle>
              <CardDescription className="text-sm">Add a beautiful gradient overlay</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={themeSettings.backgroundGradient}
                onValueChange={updateBackgroundGradient}
                className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
              >
                {backgroundGradients.map((gradient) => (
                  <div key={gradient.value}>
                    <RadioGroupItem value={gradient.value} id={`gradient-${gradient.value}`} className="sr-only" />
                    <Label
                      htmlFor={`gradient-${gradient.value}`}
                      className={cn(
                        "flex flex-col rounded-xl border-2 hover:border-primary/50 transition-all duration-200 overflow-hidden cursor-pointer group touch-manipulation",
                        themeSettings.backgroundGradient === gradient.value && "border-primary ring-2 ring-primary/20",
                      )}
                    >
                      <div
                        className="h-16 sm:h-20 w-full group-hover:scale-105 transition-transform"
                        style={{ background: gradient.preview }}
                      />
                      <div className="p-2 sm:p-3">
                        <span className="text-xs sm:text-sm font-medium">{gradient.name}</span>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Custom Background Image */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Custom Background Image</CardTitle>
              <CardDescription className="text-sm">
                Add your own background image by pasting an image URL
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="https://example.com/your-image.jpg"
                value={themeSettings.backgroundImage || ""}
                onChange={(e) => updateBackgroundImage(e.target.value)}
                className="w-full h-10 sm:h-12"
              />
              {themeSettings.backgroundImage && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border rounded-lg bg-muted/50 gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg border bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${themeSettings.backgroundImage})` }}
                    />
                    <div>
                      <p className="font-medium text-sm sm:text-base">Custom Background Active</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Image is being used as background</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateBackgroundImage("")}
                    className="w-full sm:w-auto"
                  >
                    Remove
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-6 sm:space-y-8 mt-6 sm:mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Type className="h-4 w-4 sm:h-5 sm:w-5" />
                Font Family
              </CardTitle>
              <CardDescription className="text-sm">Choose the typography style for your page</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={themeSettings.font}
                onValueChange={updateFont}
                className="grid grid-cols-1 gap-3 sm:gap-4"
              >
                {fontOptions.map((font) => (
                  <div key={font.value}>
                    <RadioGroupItem value={font.value} id={`font-${font.value}`} className="sr-only" />
                    <Label
                      htmlFor={`font-${font.value}`}
                      className={cn(
                        "flex flex-col p-4 sm:p-6 rounded-xl border-2 hover:border-primary/50 transition-all duration-200 cursor-pointer group touch-manipulation",
                        themeSettings.font === font.value && "border-primary ring-2 ring-primary/20 bg-primary/5",
                      )}
                    >
                      <div className={cn("space-y-2 sm:space-y-3", font.value)} style={{ fontFamily: font.family }}>
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg sm:text-xl font-semibold">{font.name}</h4>
                        </div>
                        <p className="text-sm sm:text-base leading-relaxed">{font.sample}</p>
                        <p className="text-xs text-muted-foreground">{font.description}</p>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Components Tab - Hidden on mobile, shown in desktop */}
        <TabsContent value="components" className="space-y-6 sm:space-y-8 mt-6 sm:mt-8">
          {/* Button Styles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Link Button Style</CardTitle>
              <CardDescription className="text-sm">Choose how your link buttons should look</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={themeSettings.buttonStyle}
                onValueChange={updateButtonStyle}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
              >
                {buttonStyles.map((style) => (
                  <div key={style.value}>
                    <RadioGroupItem value={style.value} id={`button-${style.value}`} className="sr-only" />
                    <Label
                      htmlFor={`button-${style.value}`}
                      className={cn(
                        "flex flex-col p-4 sm:p-6 rounded-xl border-2 hover:border-primary/50 transition-all duration-200 cursor-pointer group touch-manipulation",
                        themeSettings.buttonStyle === style.value &&
                          "border-primary ring-2 ring-primary/20 bg-primary/5",
                      )}
                    >
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm sm:text-base">{style.name}</h4>
                        </div>
                        <div className="flex justify-center">
                          <div
                            className={cn(
                              "px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-medium transition-all group-hover:scale-105",
                              style.preview,
                            )}
                          >
                            Sample Link
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground text-center">{style.description}</p>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Border Radius */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Border Radius</CardTitle>
              <CardDescription className="text-sm">Adjust the roundness of elements</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={themeSettings.borderRadius}
                onValueChange={updateBorderRadius}
                className="grid grid-cols-2 gap-3 sm:gap-4"
              >
                {[
                  { name: "Sharp", value: "rounded-none" },
                  { name: "Small", value: "rounded-sm" },
                  { name: "Medium", value: "rounded" },
                  { name: "Large", value: "rounded-lg" },
                ].map((option) => (
                  <div key={option.value}>
                    <RadioGroupItem value={option.value} id={`radius-${option.value}`} className="sr-only" />
                    <Label
                      htmlFor={`radius-${option.value}`}
                      className={cn(
                        "flex h-16 sm:h-20 items-center justify-center border-2 hover:border-primary/50 transition-all duration-200 cursor-pointer bg-card group touch-manipulation",
                        option.value,
                        themeSettings.borderRadius === option.value &&
                          "border-primary ring-2 ring-primary/20 bg-primary/5",
                      )}
                    >
                      <span className="font-medium group-hover:scale-105 transition-transform text-sm sm:text-base">
                        {option.name}
                      </span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Effects Tab - Enhanced with new glassmorphism features */}
        <TabsContent value="effects" className="space-y-6 sm:space-y-8 mt-6 sm:mt-8">
          {/* Visual Effects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                Visual Effects
              </CardTitle>
              <CardDescription className="text-sm">Enhance your page with visual effects</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between p-3 sm:p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <div>
                    <Label htmlFor="card-shadow" className="font-medium text-sm sm:text-base">
                      Card Shadows
                    </Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">Add depth with subtle shadows</p>
                  </div>
                </div>
                <Switch
                  id="card-shadow"
                  checked={themeSettings.effects.shadow}
                  onCheckedChange={toggleShadow}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="flex items-center justify-between p-3 sm:p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Layout className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                  </div>
                  <div>
                    <Label htmlFor="glassmorphism" className="font-medium text-sm sm:text-base">
                      Glassmorphism
                    </Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">Frosted glass effect on cards</p>
                  </div>
                </div>
                <Switch
                  id="glassmorphism"
                  checked={themeSettings.effects.glassmorphism}
                  onCheckedChange={toggleGlassmorphism}
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>

              {/* Enhanced Glassmorphism Intensity - Now goes up to 100% */}
              {themeSettings.effects.glassmorphism && (
                <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 border rounded-lg bg-muted/30">
                  <div>
                    <Label className="font-medium text-sm sm:text-base">Glassmorphism Intensity</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Adjust glass effect intensity ({Math.round(themeSettings.effects.glassmorphismOpacity * 100)}%)
                    </p>
                  </div>
                  <Slider
                    value={[themeSettings.effects.glassmorphismOpacity]}
                    onValueChange={(value) => updateGlassmorphismOpacity(value[0])}
                    max={1.0}
                    min={0.05}
                    step={0.05}
                    className="w-full"
                  />
                </div>
              )}

              {/* New Blur Glass Effect */}
              <div className="flex items-center justify-between p-3 sm:p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
                  </div>
                  <div>
                    <Label htmlFor="blur-glass" className="font-medium text-sm sm:text-base">
                      Blur Glass Effect
                    </Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">Enhanced blur effect on cards</p>
                  </div>
                </div>
                <Switch
                  id="blur-glass"
                  checked={themeSettings.effects.blurGlass}
                  onCheckedChange={toggleBlurGlass}
                  className="data-[state=checked]:bg-purple-500"
                />
              </div>

              {/* Blur Intensity Control */}
              {themeSettings.effects.blurGlass && (
                <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 border rounded-lg bg-muted/30">
                  <div>
                    <Label className="font-medium text-sm sm:text-base">Blur Intensity</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Adjust blur effect strength ({themeSettings.effects.blurIntensity}px)
                    </p>
                  </div>
                  <Slider
                    value={[themeSettings.effects.blurIntensity]}
                    onValueChange={(value) => updateBlurIntensity(value[0])}
                    max={50}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card Opacity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Card Transparency</CardTitle>
              <CardDescription className="text-sm">
                Adjust card transparency (Current: {Math.round(themeSettings.effects.cardOpacity * 100)}%)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Slider
                value={[themeSettings.effects.cardOpacity]}
                onValueChange={(value) => updateCardOpacity(value[0])}
                max={1}
                min={0.1}
                step={0.1}
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* Animation Speed */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Animation Speed</CardTitle>
              <CardDescription className="text-sm">
                Control animation duration ({themeSettings.effects.animationSpeed}ms)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Slider
                value={[themeSettings.effects.animationSpeed]}
                onValueChange={(value) => updateAnimationSpeed(value[0])}
                max={1000}
                min={100}
                step={50}
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* Reset Button */}
          <Card className="border-dashed border-2">
            <CardContent className="p-4 sm:p-6">
              <div className="text-center space-y-3 sm:space-y-4">
                <div className="p-3 rounded-xl bg-destructive/10 w-fit mx-auto">
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base">Reset All Settings</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    This will restore all theme settings to their defaults
                  </p>
                </div>
                <Button variant="outline" onClick={handleResetDefaults} className="gap-2 bg-transparent">
                  <Sparkles className="h-4 w-4" />
                  Reset Everything
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
