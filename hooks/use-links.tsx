"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export interface LinkItemProps {
  id: string
  title: string
  url: string
}

export function useLinks(initialLinks: LinkItemProps[] | (() => LinkItemProps[])) {
  const { toast } = useToast()

  // Initialize with data from localStorage if available, otherwise use initialLinks
  const [links, setLinks] = useState<LinkItemProps[]>(() => {
    const defaultLinks = typeof initialLinks === "function" ? initialLinks() : initialLinks

    if (typeof window !== "undefined") {
      const savedLinks = localStorage.getItem("linksData")
      if (savedLinks) {
        try {
          const parsed = JSON.parse(savedLinks)
          // Ensure it's an array and has valid structure
          if (Array.isArray(parsed)) {
            return parsed.map((link) => ({
              id: link.id || Date.now().toString(),
              title: link.title || "",
              url: link.url || "",
            }))
          }
        } catch (error) {
          console.error("Failed to parse saved links:", error)
        }
      }
    }
    return defaultLinks
  })

  const [newLink, setNewLink] = useState({ title: "", url: "" })

  // Function to update links from external data (like database)
  const updateLinksFromData = (newLinks: LinkItemProps[]) => {
    setLinks(newLinks)
    localStorage.setItem("linksData", JSON.stringify(newLinks))
  }

  // Add a new link
  const addLink = () => {
    if (newLink.title.trim() === "" || newLink.url.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter both a title and URL",
        variant: "destructive",
      })
      return
    }

    // Validate URL format
    try {
      new URL(newLink.url)
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL including http:// or https://",
        variant: "destructive",
      })
      return
    }

    const updatedLinks = [
      ...links,
      {
        id: Date.now().toString(),
        title: newLink.title,
        url: newLink.url,
      },
    ]

    setLinks(updatedLinks)
    setNewLink({ title: "", url: "" })

    // Immediately save to localStorage
    localStorage.setItem("linksData", JSON.stringify(updatedLinks))

    toast({
      title: "Link added",
      description: "Your new link has been added successfully",
    })
  }

  // Delete a link
  const deleteLink = (id: string) => {
    const updatedLinks = links.filter((link) => link.id !== id)
    setLinks(updatedLinks)

    // Immediately save to localStorage
    localStorage.setItem("linksData", JSON.stringify(updatedLinks))

    toast({
      title: "Link deleted",
      description: "The link has been removed",
    })
  }

  // Update a link
  const updateLink = (updatedLink: LinkItemProps) => {
    const updatedLinks = links.map((link) => (link.id === updatedLink.id ? updatedLink : link))
    setLinks(updatedLinks)

    // Immediately save to localStorage
    localStorage.setItem("linksData", JSON.stringify(updatedLinks))

    toast({
      title: "Link updated",
      description: "Your link has been updated successfully",
    })
  }

  // Handle new link input changes
  const handleNewLinkChange = (field: "title" | "url", value: string) => {
    setNewLink((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Auto-save links whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("linksData", JSON.stringify(links))
    }
  }, [links])

  return {
    links,
    newLink,
    addLink,
    deleteLink,
    updateLink,
    handleNewLinkChange,
    updateLinksFromData, // Export this for external updates
  }
}
