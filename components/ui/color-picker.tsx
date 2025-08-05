"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Palette } from "lucide-react"

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [rgbValues, setRgbValues] = useState(() => {
    // Convert hex to RGB
    const hex = value.replace("#", "")
    const r = Number.parseInt(hex.substring(0, 2), 16) || 0
    const g = Number.parseInt(hex.substring(2, 4), 16) || 0
    const b = Number.parseInt(hex.substring(4, 6), 16) || 0
    return { r, g, b }
  })

  const handleRgbChange = (component: "r" | "g" | "b", newValue: number) => {
    const newRgb = { ...rgbValues, [component]: Math.max(0, Math.min(255, newValue)) }
    setRgbValues(newRgb)

    // Convert RGB to hex
    const hex = `#${newRgb.r.toString(16).padStart(2, "0")}${newRgb.g.toString(16).padStart(2, "0")}${newRgb.b.toString(16).padStart(2, "0")}`
    onChange(hex)
  }

  const handleHexChange = (hex: string) => {
    if (hex.match(/^#[0-9A-Fa-f]{6}$/)) {
      const r = Number.parseInt(hex.substring(1, 3), 16)
      const g = Number.parseInt(hex.substring(3, 5), 16)
      const b = Number.parseInt(hex.substring(5, 7), 16)
      setRgbValues({ r, g, b })
      onChange(hex)
    }
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start gap-2 h-10 bg-transparent">
            <div className="w-4 h-4 rounded border" style={{ backgroundColor: value }} />
            <span className="flex-1 text-left">{value}</span>
            <Palette className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Hex Color</Label>
              <Input value={value} onChange={(e) => handleHexChange(e.target.value)} placeholder="#000000" />
            </div>

            <div className="space-y-3">
              <Label>RGB Values</Label>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="w-4">R:</Label>
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={rgbValues.r}
                    onChange={(e) => handleRgbChange("r", Number.parseInt(e.target.value) || 0)}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rgbValues.r}
                    onChange={(e) => handleRgbChange("r", Number.parseInt(e.target.value))}
                    className="flex-1 h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Label className="w-4">G:</Label>
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={rgbValues.g}
                    onChange={(e) => handleRgbChange("g", Number.parseInt(e.target.value) || 0)}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rgbValues.g}
                    onChange={(e) => handleRgbChange("g", Number.parseInt(e.target.value))}
                    className="flex-1 h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Label className="w-4">B:</Label>
                  <Input
                    type="number"
                    min="0"
                    max="255"
                    value={rgbValues.b}
                    onChange={(e) => handleRgbChange("b", Number.parseInt(e.target.value) || 0)}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rgbValues.b}
                    onChange={(e) => handleRgbChange("b", Number.parseInt(e.target.value))}
                    className="flex-1 h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center p-4 border rounded-lg">
              <div className="w-16 h-16 rounded-lg border shadow-sm" style={{ backgroundColor: value }} />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
