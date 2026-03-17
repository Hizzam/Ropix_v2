"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function Dashboard() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<string>("cartoon")
  const [credits, setCredits] = useState<number | null>(null)

  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // 🔐 Protect dashboard + fetch credits
  useEffect(() => {
    const initDashboard = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/login")
        return
      }

      const { data } = await supabase
        .from("profiles")
        .select("image_credits")
        .eq("id", session.user.id)
        .single()

      if (data) {
        setCredits(data.image_credits)
      }

      setLoading(false)
    }

    initDashboard()
  }, [router])

  const handleGenerate = async () => {
    if (!uploadedImage) {
      setErrorMessage("Please upload an image first.")
      return
    }

    if (credits === 0) {
      setErrorMessage("No credits left.")
      return
    }

    setIsGenerating(true)
    setErrorMessage(null)
    setGeneratedImage(null)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setErrorMessage("Not logged in.")
        setIsGenerating(false)
        return
      }

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          style: selectedStyle,
        }),
      })

      const data = await res.json()

      if (data.image) {
        setGeneratedImage(data.image)
        setCredits(data.credits_remaining)
      } else {
        setErrorMessage(data.error || "Generation failed.")
      }
    } catch (err) {
      setErrorMessage("Something went wrong. Try again.")
    }

    setIsGenerating(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-8 gap-8 bg-gray-100">
      <div className="w-full max-w-3xl bg-white p-8 rounded-xl shadow-lg flex flex-col gap-6">

        <h1 className="text-4xl font-bold text-center">Ropix Dashboard</h1>

        {/* Credits */}
        {credits !== null ? (
          <p className="text-lg text-center">
            Credits remaining: <strong>{credits}</strong>
          </p>
        ) : (
          <p className="text-center">Loading credits...</p>
        )}

        {/* Upload */}
        <div className="flex flex-col items-center gap-3">
          <label className="font-bold text-lg">
            Upload Your Roblox Screenshot:
          </label>

          <input
            type="file"
            accept="image/png, image/jpeg"
            className="border px-4 py-2 rounded cursor-pointer hover:bg-gray-100"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0]
                const reader = new FileReader()
                reader.onload = (ev) =>
                  setUploadedImage(ev.target?.result as string)
                reader.readAsDataURL(file)
              }
            }}
          />

          {uploadedImage && (
            <img
              src={uploadedImage}
              alt="preview"
              className="w-64 h-64 object-contain border mt-2 rounded"
            />
          )}
        </div>

        {/* Style Selection */}
        <div className="flex flex-col items-center gap-2">
          <label className="font-bold text-lg">Choose Style:</label>
          <select
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="cartoon">Cartoon</option>
            <option value="anime">Anime</option>
            <option value="fantasy">Fantasy Adventure</option>
            <option value="epic">Epic Battle</option>
            <option value="scifi">Sci-Fi</option>
            <option value="cute">Cute Roblox Style</option>
          </select>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={credits === 0 || isGenerating}
          className={`px-6 py-3 rounded text-white text-lg font-semibold transition ${
            credits === 0 || isGenerating
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-800"
          }`}
        >
          {isGenerating
            ? "Generating..."
            : credits === 0
            ? "No Credits Left"
            : "Generate (1 Credit)"}
        </button>

        {/* Error Message */}
        {errorMessage && (
          <p className="text-red-500 text-center font-semibold">
            {errorMessage}
          </p>
        )}

        {/* Generated Image */}
        {generatedImage && (
          <div className="flex flex-col items-center gap-4 mt-6">
            <h2 className="text-xl font-bold">Your Generated Thumbnail</h2>
            <img
              src={generatedImage}
              alt="Generated Thumbnail"
              className="w-full max-w-lg border rounded-lg shadow-md"
            />
            <button
  onClick={async () => {
    const response = await fetch(generatedImage!)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = "ropix-thumbnail.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    window.URL.revokeObjectURL(url)
  }}
  className="bg-black text-white px-5 py-2 rounded hover:bg-gray-800 transition"
>
  Download Image
</button>
          </div>
        )}
      </div>
    </div>
  )
}