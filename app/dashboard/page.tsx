"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface GeneratedImage {
  id: string
  image_url: string
  style: string
  genre: string | null
  added_text: string | null
  created_at: string
}

export default function Dashboard() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<string>("cartoon")
  const [genre, setGenre] = useState<string>("")
  const [addedText, setAddedText] = useState<string>("")
  const [credits, setCredits] = useState<number | null>(null)
  const [history, setHistory] = useState<GeneratedImage[]>([])

  // 🔥 Fetch credits + history on load
  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data: profile } = await supabase
        .from("profiles")
        .select("image_credits")
        .eq("id", session.user.id)
        .single()

      if (profile) setCredits(profile.image_credits)

      const { data: images } = await supabase
        .from("generated_images")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })

      if (images) setHistory(images as GeneratedImage[])
    }

    fetchData()
  }, [])

  // 🔥 Canvas Text Overlay Download
  const handleDownload = (imageUrl: string, text?: string | null) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = imageUrl

    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Draw background
      ctx.drawImage(img, 0, 0)

      if (text) {
        ctx.font = "bold 120px Impact"
        ctx.fillStyle = "white"
        ctx.strokeStyle = "black"
        ctx.lineWidth = 8
        ctx.textAlign = "center"

        const x = canvas.width / 2
        const y = canvas.height - 150

        ctx.strokeText(text, x, y)
        ctx.fillText(text, x, y)
      }

      const finalImage = canvas.toDataURL("image/png")

      const link = document.createElement("a")
      link.href = finalImage
      link.download = "ropix-thumbnail.png"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // 🔥 Generate
  const handleGenerate = async () => {
    if (!uploadedImage) return alert("Upload an image first")
    if (credits === 0) return alert("No credits left!")

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return alert("Not logged in")

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          style: selectedStyle,
          genre,
          added_text: addedText,
        }),
      })

      const data = await res.json()

      if (data.image) {
        setCredits(data.credits_remaining)

        // Update history locally
        const newItem: GeneratedImage = {
          id: crypto.randomUUID(),
          image_url: data.image,
          style: selectedStyle,
          genre,
          added_text: addedText,
          created_at: new Date().toISOString(),
        }

        setHistory(prev => [newItem, ...prev])

        // Download with text overlay
        handleDownload(data.image, addedText)

      } else {
        alert("Generation failed: " + (data.error || "Unknown error"))
      }
    } catch (error) {
      console.error(error)
      alert("Generation failed.")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-8 gap-6">
      <h1 className="text-4xl font-bold">Ropix Dashboard</h1>

      {credits !== null ? (
        <p className="text-lg">
          Credits remaining: <strong>{credits}</strong>
        </p>
      ) : (
        <p>Loading credits...</p>
      )}

      {/* Upload */}
      <div className="flex flex-col items-center gap-2">
        <label className="font-bold text-lg">
          Upload Roblox Screenshot:
        </label>
        <input
          type="file"
          accept="image/png, image/jpeg"
          className="border px-4 py-2 rounded"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const reader = new FileReader()
              reader.onload = (ev) =>
                setUploadedImage(ev.target?.result as string)
              reader.readAsDataURL(e.target.files[0])
            }
          }}
        />
        {uploadedImage && (
          <img
            src={uploadedImage}
            alt="preview"
            className="w-64 h-64 object-contain border mt-2"
          />
        )}
      </div>

      {/* Style */}
      <div className="flex flex-col items-center gap-2">
        <label className="font-bold text-lg">Style</label>
        <select
          value={selectedStyle}
          onChange={(e) => setSelectedStyle(e.target.value)}
          className="border px-3 py-1 rounded"
        >
          <option value="cartoon">Cartoon</option>
          <option value="anime">Anime</option>
          <option value="fantasy">Fantasy</option>
          <option value="epic">Epic</option>
          <option value="scifi">Sci-Fi</option>
          <option value="cute">Cute</option>
        </select>

        <label className="font-bold text-lg mt-3">Genre (optional)</label>
        <input
          type="text"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="border px-3 py-1 rounded"
          placeholder="e.g. RPG, Obby, Simulator"
        />

        <label className="font-bold text-lg mt-3">Text on Thumbnail</label>
        <input
          type="text"
          value={addedText}
          onChange={(e) => setAddedText(e.target.value)}
          className="border px-3 py-1 rounded"
          placeholder="e.g. BLOX FRUITS"
        />
      </div>

      {/* Generate */}
      <button
        onClick={handleGenerate}
        disabled={credits === 0}
        className={`px-6 py-2 rounded text-white font-semibold ${
          credits === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black hover:bg-gray-800"
        }`}
      >
        {credits === 0 ? "No Credits Left" : "Generate (1 Credit)"}
      </button>

      {/* History */}
      <div className="w-full mt-10">
        <h2 className="text-2xl font-bold mb-4">History</h2>

        {history.length === 0 && (
          <p>No thumbnails generated yet.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="border p-3 flex flex-col items-center rounded"
            >
              <img
                src={item.image_url}
                alt="generated"
                className="w-full h-48 object-cover mb-2"
              />
              <p className="text-sm"><strong>Style:</strong> {item.style}</p>
              {item.genre && (
                <p className="text-sm"><strong>Genre:</strong> {item.genre}</p>
              )}
              {item.added_text && (
                <p className="text-sm"><strong>Text:</strong> {item.added_text}</p>
              )}

              <button
                className="bg-blue-600 text-white px-3 py-1 mt-2 rounded"
                onClick={() =>
                  handleDownload(item.image_url, item.added_text)
                }
              >
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}