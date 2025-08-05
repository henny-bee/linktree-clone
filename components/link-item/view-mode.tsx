"use client"
import { cn } from "@/lib/utils"
import type React from "react"

import { useTheme } from "next-themes"
import { useThemeSettings } from "@/hooks/use-theme-settings"
import { LinkItemActions } from "@/components/link-item-actions"
import { getLinkIcon } from "@/components/link-item/utils"
import { useMemo } from "react"

interface ViewModeProps {
  title: string
  url: string
}

export function ViewMode({ title, url }: ViewModeProps) {
  const { theme } = useTheme()
  const { themeSettings, getThemeColors } = useThemeSettings()
  const isDarkTheme = theme === "dark"

  // Memoize theme colors to prevent unnecessary recalculations
  const themeColors = useMemo(() => {
    return getThemeColors(themeSettings.colorTheme)
  }, [themeSettings.colorTheme, getThemeColors])

  // Helper function to convert HSL values to RGB
  function hslToRgb(h: number, s: number, l: number) {
    s /= 100
    l /= 100

    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
    const m = l - c / 2

    let r = 0,
      g = 0,
      b = 0

    if (0 <= h && h < 60) {
      r = c
      g = x
      b = 0
    } else if (60 <= h && h < 120) {
      r = x
      g = c
      b = 0
    } else if (120 <= h && h < 180) {
      r = 0
      g = c
      b = x
    } else if (180 <= h && h < 240) {
      r = 0
      g = x
      b = c
    } else if (240 <= h && h < 300) {
      r = x
      g = 0
      b = c
    } else if (300 <= h && h < 360) {
      r = c
      g = 0
      b = x
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    }
  }

  // Update the dynamicStyles useMemo to handle the new HSL format
  const dynamicStyles = useMemo(() => {
    const primaryColor = themeColors.primary
    let primaryColorRgb

    // Check if the color is in HSL format (space-separated values)
    if (primaryColor.includes(" ")) {
      const [h, s, l] = primaryColor.split(" ").map(Number)
      primaryColorRgb = hslToRgb(h, s, l)
    } else if (primaryColor.startsWith("#")) {
      primaryColorRgb = hexToRgb(primaryColor)
    } else {
      // Default fallback
      primaryColorRgb = { r: 0, g: 0, b: 0 }
    }

    return {
      hoverBg: isDarkTheme
        ? `rgba(${primaryColorRgb?.r || 0}, ${primaryColorRgb?.g || 0}, ${primaryColorRgb?.b || 0}, 0.1)`
        : `rgba(${primaryColorRgb?.r || 0}, ${primaryColorRgb?.g || 0}, ${primaryColorRgb?.b || 0}, 0.05)`,
      iconBg: `hsl(${primaryColor})`,
      gradientFrom: `rgba(${primaryColorRgb?.r || 0}, ${primaryColorRgb?.g || 0}, ${primaryColorRgb?.b || 0}, 0.05)`,
      transitionDuration: `${themeSettings.effects.animationSpeed}ms`,
      opacity: themeSettings.effects.cardOpacity,
      primaryRgb: primaryColorRgb,
    }
  }, [themeColors, isDarkTheme, themeSettings.effects])

  // Add button style classes based on themeSettings.buttonStyle
  const getButtonStyleClasses = (buttonStyle: string) => {
    const baseClasses = "transition-all ease-in-out border"

    switch (buttonStyle) {
      case "sharp":
        return `${baseClasses} rounded-none shadow-sm hover:shadow-md`
      case "rounded":
        return `${baseClasses} rounded-full shadow-sm hover:shadow-md`
      case "outlined":
        return `${baseClasses} border-2 bg-transparent hover:bg-primary/5 rounded-lg`
      case "minimal":
        return `${baseClasses} bg-transparent hover:bg-primary/5 border-transparent rounded-lg`
      case "gradient":
        return `${baseClasses} border-transparent rounded-lg shadow-sm hover:shadow-md`
      case "soft":
        return `${baseClasses} border-transparent rounded-lg shadow-sm hover:shadow-md`
      case "glass":
        return `${baseClasses} border-white/20 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md`
      default:
        return `${baseClasses} rounded-lg shadow-sm hover:shadow-md`
    }
  }

  // Get button background styles
  const getButtonBackgroundStyle = (buttonStyle: string) => {
    const { primaryRgb } = dynamicStyles

    switch (buttonStyle) {
      case "gradient":
        return {
          background: `linear-gradient(135deg, hsl(${themeColors.primary}), hsl(${themeColors.primary}) 80%)`,
        }
      case "soft":
        return {
          backgroundColor: `rgba(${primaryRgb?.r || 0}, ${primaryRgb?.g || 0}, ${primaryRgb?.b || 0}, 0.1)`,
        }
      case "glass":
        return {
          backgroundColor: isDarkTheme ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(10px)",
        }
      case "outlined":
        return {
          borderColor: `hsl(${themeColors.primary})`,
          backgroundColor: "transparent",
        }
      case "minimal":
        return {
          backgroundColor: "transparent",
        }
      default:
        return {}
    }
  }

  // Update the component to use button styles
  const dynamicButtonClasses = getButtonStyleClasses(themeSettings.buttonStyle)
  const dynamicButtonStyle = getButtonBackgroundStyle(themeSettings.buttonStyle)

  return (
    <div
      className={cn(
        "link-item-container relative overflow-hidden group",
        "hover:border-primary/30",
        "active:scale-[0.98] active:shadow-inner",
        dynamicButtonClasses,
        themeSettings.effects.glassmorphism && "glassmorphism",
      )}
      style={
        {
          transitionDuration: dynamicStyles.transitionDuration,
          opacity: dynamicStyles.opacity,
          "--hover-bg": dynamicStyles.hoverBg,
          ...dynamicButtonStyle,
        } as React.CSSProperties
      }
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(to right, ${dynamicStyles.gradientFrom}, transparent)`,
          transitionDuration: dynamicStyles.transitionDuration,
        }}
      ></div>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn("flex items-center gap-3 p-3 w-full", "transition-colors", "font-medium", themeSettings.font)}
        style={{
          transitionDuration: dynamicStyles.transitionDuration,
          color: themeSettings.fontColors?.linkTitle || "#000000", // Use linkTitle color
        }}
      >
        <div
          className={cn(
            "flex items-center justify-center",
            "w-8 h-8 rounded-full",
            "text-white",
            "transition-all",
            "group-hover:scale-110 group-hover:shadow-sm",
          )}
          style={{
            backgroundColor: dynamicStyles.iconBg,
            transitionDuration: dynamicStyles.transitionDuration,
          }}
        >
          {getLinkIcon(url)}
        </div>
        <span className="flex-1" style={{ color: themeSettings.fontColors?.linkTitle || "#000000" }}>
          {title}
        </span>
      </a>

      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
        <LinkItemActions url={url} />
      </div>
    </div>
  )
}

// Helper function to convert hex to rgb
function hexToRgb(hex: string) {
  // Remove the # if present
  hex = hex.replace("#", "")

  // Parse the hex values
  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)

  // Check if the parsing was successful
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return null
  }

  return { r, g, b }
}
