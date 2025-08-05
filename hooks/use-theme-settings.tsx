"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext, useCallback } from "react"
import { useTheme } from "next-themes"

// Define the theme settings type
export interface ThemeSettings {
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
}

// Theme color mappings - this helps ensure consistent color application
export const themeColorMappings = {
  default: {
    primary: "0 0% 9%",
    secondary: "0 0% 96.1%",
    accent: "0 0% 96.1%",
  },
  rose: {
    primary: "347 77% 50%",
    secondary: "355 100% 97%",
    accent: "347 77% 92%",
  },
  green: {
    primary: "160 84% 39%",
    secondary: "150 100% 96%",
    accent: "160 84% 92%",
  },
  purple: {
    primary: "259 94% 51%",
    secondary: "270 100% 98%",
    accent: "259 94% 93%",
  },
  orange: {
    primary: "24 94% 53%",
    secondary: "30 100% 97%",
    accent: "24 94% 93%",
  },
  blue: {
    primary: "217 91% 60%",
    secondary: "213 100% 97%",
    accent: "217 91% 93%",
  },
  teal: {
    primary: "173 80% 40%",
    secondary: "180 100% 97%",
    accent: "173 80% 93%",
  },
  pink: {
    primary: "330 81% 60%",
    secondary: "327 100% 97%",
    accent: "330 81% 93%",
  },
}

// Default theme settings with enhanced glassmorphism
const defaultThemeSettings: ThemeSettings = {
  colorTheme: "default",
  gradient: "none",
  pattern: "none",
  patternColor: "#000000",
  font: "font-sans",
  fontColors: {
    displayName: "#000000",
    bio: "#6b7280",
    linkTitle: "#000000",
    linkUrl: "#6b7280",
  },
  buttonStyle: "default",
  borderRadius: "rounded-lg",
  backgroundColor: "bg-secondary",
  backgroundGradient: "none",
  backgroundImage: "",
  effects: {
    shadow: true,
    glassmorphism: false,
    glassmorphismOpacity: 0.1,
    cardOpacity: 1,
    animationSpeed: 400,
    blurGlass: false,
    blurIntensity: 10,
  },
}

// Create context
const ThemeSettingsContext = createContext<{
  themeSettings: ThemeSettings
  updateColorTheme: (value: string) => void
  updateGradient: (value: string) => void
  updatePattern: (value: string) => void
  updatePatternColor: (value: string) => void
  updateFont: (value: string) => void
  updateFontColor: (value: string) => void
  updateButtonStyle: (value: string) => void
  updateBorderRadius: (value: string) => void
  updateBackgroundColor: (value: string) => void
  updateBackgroundGradient: (value: string) => void
  updateBackgroundImage: (value: string) => void
  updateCardOpacity: (value: number) => void
  updateAnimationSpeed: (value: number) => void
  updateGlassmorphismOpacity: (value: number) => void
  updateBlurIntensity: (value: number) => void
  toggleShadow: (value: boolean) => void
  toggleGlassmorphism: (value: boolean) => void
  toggleBlurGlass: (value: boolean) => void
  resetToDefaults: () => void
  getThemeColors: (theme: string) => { primary: string; secondary: string; accent: string }
  updateFontColors: (type: keyof ThemeSettings["fontColors"], value: string) => void
}>({
  themeSettings: defaultThemeSettings,
  updateColorTheme: () => {},
  updateGradient: () => {},
  updatePattern: () => {},
  updatePatternColor: () => {},
  updateFont: () => {},
  updateFontColor: () => {},
  updateButtonStyle: () => {},
  updateBorderRadius: () => {},
  updateBackgroundColor: () => {},
  updateBackgroundGradient: () => {},
  updateBackgroundImage: () => {},
  updateCardOpacity: () => {},
  updateAnimationSpeed: () => {},
  updateGlassmorphismOpacity: () => {},
  updateBlurIntensity: () => {},
  toggleShadow: () => {},
  toggleGlassmorphism: () => {},
  toggleBlurGlass: () => {},
  resetToDefaults: () => {},
  getThemeColors: () => ({ primary: "", secondary: "", accent: "" }),
  updateFontColors: () => {},
})

export function ThemeSettingsProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme()
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(() => {
    // Initialize with saved settings if available
    if (typeof window !== "undefined") {
      const savedSettings = localStorage.getItem("themeSettings")
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings)
          // Ensure all required fields exist with fallbacks
          return {
            colorTheme: parsed.colorTheme || defaultThemeSettings.colorTheme,
            gradient: parsed.gradient || defaultThemeSettings.gradient,
            pattern: parsed.pattern || defaultThemeSettings.pattern,
            patternColor: parsed.patternColor || defaultThemeSettings.patternColor,
            font: parsed.font || defaultThemeSettings.font,
            fontColors: {
              displayName: parsed.fontColors?.displayName || defaultThemeSettings.fontColors.displayName,
              bio: parsed.fontColors?.bio || defaultThemeSettings.fontColors.bio,
              linkTitle: parsed.fontColors?.linkTitle || defaultThemeSettings.fontColors.linkTitle,
              linkUrl: parsed.fontColors?.linkUrl || defaultThemeSettings.fontColors.linkUrl,
            },
            buttonStyle: parsed.buttonStyle || defaultThemeSettings.buttonStyle,
            borderRadius: parsed.borderRadius || defaultThemeSettings.borderRadius,
            backgroundColor: parsed.backgroundColor || defaultThemeSettings.backgroundColor,
            backgroundGradient: parsed.backgroundGradient || defaultThemeSettings.backgroundGradient,
            backgroundImage: parsed.backgroundImage || defaultThemeSettings.backgroundImage,
            effects: {
              shadow:
                parsed.effects?.shadow !== undefined ? parsed.effects.shadow : defaultThemeSettings.effects.shadow,
              glassmorphism:
                parsed.effects?.glassmorphism !== undefined
                  ? parsed.effects.glassmorphism
                  : defaultThemeSettings.effects.glassmorphism,
              glassmorphismOpacity:
                parsed.effects?.glassmorphismOpacity || defaultThemeSettings.effects.glassmorphismOpacity,
              cardOpacity: parsed.effects?.cardOpacity || defaultThemeSettings.effects.cardOpacity,
              animationSpeed: parsed.effects?.animationSpeed || defaultThemeSettings.effects.animationSpeed,
              blurGlass:
                parsed.effects?.blurGlass !== undefined
                  ? parsed.effects.blurGlass
                  : defaultThemeSettings.effects.blurGlass,
              blurIntensity: parsed.effects?.blurIntensity || defaultThemeSettings.effects.blurIntensity,
            },
          }
        } catch (error) {
          console.error("Failed to parse theme settings:", error)
        }
      }
    }
    return defaultThemeSettings
  })
  const [isInitialized, setIsInitialized] = useState(false)

  // Memoized function to get theme colors - improves performance by avoiding recalculations
  const getThemeColors = useCallback((themeName: string) => {
    return themeColorMappings[themeName as keyof typeof themeColorMappings] || themeColorMappings.default
  }, [])

  // Initialize after component mount
  useEffect(() => {
    setIsInitialized(true)
  }, [])

  // Apply theme settings immediately when they change - ONLY to preview areas
  useEffect(() => {
    if (isInitialized) {
      // Save to localStorage immediately
      localStorage.setItem("themeSettings", JSON.stringify(themeSettings))

      // Apply CSS variables based on theme settings - ONLY for preview areas
      applyThemeSettings(themeSettings, theme === "dark")
    }
  }, [themeSettings, theme, isInitialized])

  // Apply the applyThemeSettings function to correctly set HSL values - ONLY for preview
  const applyThemeSettings = (settings: ThemeSettings, isDark: boolean) => {
    const root = document.documentElement

    // Apply theme colors
    const colors = getThemeColors(settings.colorTheme)

    if (isDark) {
      root.style.setProperty("--primary", colors.primary)
      root.style.setProperty("--primary-foreground", "0 0% 98%")
      root.style.setProperty("--icon-text-color", "255, 255, 255")
      root.style.setProperty("--secondary", colors.secondary)
      root.style.setProperty("--secondary-foreground", "0 0% 98%")
      root.style.setProperty("--accent", colors.accent)
      root.style.setProperty("--accent-foreground", "0 0% 98%")
      root.style.setProperty("--pattern-color", settings.patternColor)
    } else {
      root.style.setProperty("--primary", colors.primary)
      root.style.setProperty("--primary-foreground", "0 0% 98%")
      root.style.setProperty("--icon-text-color", "255, 255, 255")
      root.style.setProperty("--secondary", colors.secondary)
      root.style.setProperty("--secondary-foreground", "0 0% 9%")
      root.style.setProperty("--accent", colors.accent)
      root.style.setProperty("--accent-foreground", "0 0% 9%")
      root.style.setProperty("--pattern-color", settings.patternColor)
    }

    // Apply font colors with fallbacks
    const fontColors = settings.fontColors || defaultThemeSettings.fontColors

    root.style.setProperty("--font-color-display-name", fontColors.displayName)
    root.style.setProperty("--font-color-bio", fontColors.bio)
    root.style.setProperty("--font-color-link-title", fontColors.linkTitle || fontColors.linkUrl || "#000000")
    root.style.setProperty("--font-color-link-url", fontColors.linkUrl)

    // Apply glassmorphism opacity
    root.style.setProperty("--glassmorphism-opacity", (settings.effects.glassmorphismOpacity || 0.1).toString())

    // Apply blur intensity
    root.style.setProperty("--blur-intensity", `${settings.effects.blurIntensity || 10}px`)

    // Apply other settings
    root.style.setProperty("--animation-speed", `${settings.effects.animationSpeed}ms`)
    root.style.setProperty("--card-opacity", settings.effects.cardOpacity.toString())
    root.style.setProperty("--card-border-radius", getBorderRadiusValue(settings.borderRadius))

    // Apply font family ONLY to preview areas, not the entire edit page
    const previewElements = document.querySelectorAll(".preview-container, .profile-view")
    previewElements.forEach((element) => {
      element.classList.remove(
        "font-sans",
        "font-serif",
        "font-mono",
        "font-display",
        "font-body",
        "font-slab",
        "font-rounded",
        "font-code",
      )
      element.classList.add(settings.font)
    })
  }

  // Helper function to get the actual pixel value for border radius
  const getBorderRadiusValue = (borderRadiusClass: string): string => {
    switch (borderRadiusClass) {
      case "rounded-none":
        return "0px"
      case "rounded-sm":
        return "0.125rem"
      case "rounded":
        return "0.25rem"
      case "rounded-lg":
        return "0.5rem"
      default:
        return "0.5rem"
    }
  }

  // Auto-save function for all updates
  const saveSettings = useCallback((newSettings: ThemeSettings) => {
    localStorage.setItem("themeSettings", JSON.stringify(newSettings))
  }, [])

  // All the existing update functions...
  const updateColorTheme = useCallback(
    (value: string) => {
      setThemeSettings((prev) => {
        const updated = { ...prev, colorTheme: value }
        saveSettings(updated)
        return updated
      })

      const colors = getThemeColors(value)
      const root = document.documentElement
      root.style.setProperty("--primary", colors.primary)
      root.style.setProperty("--secondary", colors.secondary)
      root.style.setProperty("--accent", colors.accent)
    },
    [getThemeColors, saveSettings],
  )

  const updateGradient = useCallback(
    (value: string) => {
      setThemeSettings((prev) => {
        const updated = { ...prev, gradient: value }
        saveSettings(updated)
        return updated
      })
    },
    [saveSettings],
  )

  const updatePattern = useCallback(
    (value: string) => {
      setThemeSettings((prev) => {
        const updated = { ...prev, pattern: value }
        saveSettings(updated)
        return updated
      })
    },
    [saveSettings],
  )

  const updateFont = useCallback(
    (value: string) => {
      setThemeSettings((prev) => {
        const updated = { ...prev, font: value }
        saveSettings(updated)
        return updated
      })

      const previewElements = document.querySelectorAll(".preview-container, .profile-view")
      previewElements.forEach((element) => {
        element.classList.remove(
          "font-sans",
          "font-serif",
          "font-mono",
          "font-display",
          "font-body",
          "font-slab",
          "font-rounded",
          "font-code",
        )
        element.classList.add(value)
      })
    },
    [saveSettings],
  )

  const updateFontColor = useCallback(
    (value: string) => {
      setThemeSettings((prev) => {
        const updated = { ...prev, fontColor: value }
        saveSettings(updated)
        return updated
      })
      document.documentElement.style.setProperty("--font-color", value)
    },
    [saveSettings],
  )

  const updateBorderRadius = useCallback(
    (value: string) => {
      setThemeSettings((prev) => {
        const updated = { ...prev, borderRadius: value }
        saveSettings(updated)
        return updated
      })
      document.documentElement.style.setProperty("--card-border-radius", getBorderRadiusValue(value))
    },
    [saveSettings],
  )

  const updateCardOpacity = useCallback(
    (value: number) => {
      setThemeSettings((prev) => {
        const updated = {
          ...prev,
          effects: { ...prev.effects, cardOpacity: value },
        }
        saveSettings(updated)
        return updated
      })
      document.documentElement.style.setProperty("--card-opacity", value.toString())
    },
    [saveSettings],
  )

  const updateAnimationSpeed = useCallback(
    (value: number) => {
      setThemeSettings((prev) => {
        const updated = {
          ...prev,
          effects: { ...prev.effects, animationSpeed: value },
        }
        saveSettings(updated)
        return updated
      })
      document.documentElement.style.setProperty("--animation-speed", `${value}ms`)
    },
    [saveSettings],
  )

  const updateGlassmorphismOpacity = useCallback(
    (value: number) => {
      setThemeSettings((prev) => {
        const updated = {
          ...prev,
          effects: { ...prev.effects, glassmorphismOpacity: value || 0.1 },
        }
        saveSettings(updated)
        return updated
      })
      document.documentElement.style.setProperty("--glassmorphism-opacity", (value || 0.1).toString())
    },
    [saveSettings],
  )

  const updateBlurIntensity = useCallback(
    (value: number) => {
      setThemeSettings((prev) => {
        const updated = {
          ...prev,
          effects: { ...prev.effects, blurIntensity: value },
        }
        saveSettings(updated)
        return updated
      })
      document.documentElement.style.setProperty("--blur-intensity", `${value}px`)
    },
    [saveSettings],
  )

  const toggleShadow = useCallback(
    (value: boolean) => {
      setThemeSettings((prev) => {
        const updated = {
          ...prev,
          effects: { ...prev.effects, shadow: value },
        }
        saveSettings(updated)
        return updated
      })
    },
    [saveSettings],
  )

  const toggleGlassmorphism = useCallback(
    (value: boolean) => {
      setThemeSettings((prev) => {
        const updated = {
          ...prev,
          effects: { ...prev.effects, glassmorphism: value },
        }
        saveSettings(updated)
        return updated
      })
    },
    [saveSettings],
  )

  const toggleBlurGlass = useCallback(
    (value: boolean) => {
      setThemeSettings((prev) => {
        const updated = {
          ...prev,
          effects: { ...prev.effects, blurGlass: value },
        }
        saveSettings(updated)
        return updated
      })
    },
    [saveSettings],
  )

  const resetToDefaults = useCallback(() => {
    const defaultSettings = {
      ...defaultThemeSettings,
      fontColors: {
        displayName: "#000000",
        bio: "#6b7280",
        linkTitle: "#000000",
        linkUrl: "#6b7280",
      },
    }
    setThemeSettings(defaultSettings)
    saveSettings(defaultSettings)
  }, [saveSettings])

  const updateBackgroundColor = useCallback(
    (value: string) => {
      setThemeSettings((prev) => {
        const updated = { ...prev, backgroundColor: value }
        saveSettings(updated)
        return updated
      })
    },
    [saveSettings],
  )

  const updateBackgroundGradient = useCallback(
    (value: string) => {
      setThemeSettings((prev) => {
        const updated = { ...prev, backgroundGradient: value }
        saveSettings(updated)
        return updated
      })
    },
    [saveSettings],
  )

  const updateBackgroundImage = useCallback(
    (value: string) => {
      setThemeSettings((prev) => {
        const updated = { ...prev, backgroundImage: value }
        saveSettings(updated)
        return updated
      })
    },
    [saveSettings],
  )

  const updatePatternColor = useCallback(
    (value: string) => {
      setThemeSettings((prev) => {
        const updated = { ...prev, patternColor: value }
        saveSettings(updated)
        return updated
      })
      document.documentElement.style.setProperty("--pattern-color", value)
    },
    [saveSettings],
  )

  const updateButtonStyle = useCallback(
    (value: string) => {
      setThemeSettings((prev) => {
        const updated = { ...prev, buttonStyle: value }
        saveSettings(updated)
        return updated
      })
    },
    [saveSettings],
  )

  const updateFontColors = useCallback(
    (type: keyof ThemeSettings["fontColors"], value: string) => {
      setThemeSettings((prev) => {
        const updated = {
          ...prev,
          fontColors: { ...prev.fontColors, [type]: value },
        }
        saveSettings(updated)
        return updated
      })

      // Apply font colors immediately
      const root = document.documentElement
      const cssProperty = `--font-color-${type.replace(/([A-Z])/g, "-$1").toLowerCase()}`
      root.style.setProperty(cssProperty, value)
    },
    [saveSettings],
  )

  return (
    <ThemeSettingsContext.Provider
      value={{
        themeSettings,
        updateColorTheme,
        updateGradient,
        updatePattern,
        updatePatternColor,
        updateFont,
        updateFontColor,
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
        getThemeColors,
        updateFontColors,
      }}
    >
      {children}
    </ThemeSettingsContext.Provider>
  )
}

export function useThemeSettings() {
  return useContext(ThemeSettingsContext)
}
