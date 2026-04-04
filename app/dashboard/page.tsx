"use client"	

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import ThumbnailEditor from "@/app/components/ThumbnailEditor"
import Link from "next/link"

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
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<string>("cartoon")
  const [genre, setGenre] = useState<string>("")
  const [addedText, setAddedText] = useState<string>("")
  const [credits, setCredits] = useState<number | null>(null)
  const [history, setHistory] = useState<GeneratedImage[]>([])
  const [loading, setLoading] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [showCreditPopup, setShowCreditPopup] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  // ✅ FIXED AUTH HANDLING
useEffect(() => {
  let isMounted = true

  const fetchData = async (session: any) => {
    if (!isMounted) return
    const userId = session.user.id
    const email = session.user.email ?? ""
    setUserEmail(email)

    const { data: profile } = await supabase
      .from("profiles")
      .select("image_credits")
      .eq("id", userId)
      .single()
    if (profile) setCredits(profile.image_credits)

    const { data: images } = await supabase
      .from("generated_images")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
    if (images) setHistory(images as GeneratedImage[])

    if (isMounted) setPageLoading(false)
  }

  // ✅ Safety timeout — if stuck loading for 5 seconds, redirect to login
  const timeout = setTimeout(() => {
    if (isMounted) {
      setPageLoading(false)
      window.location.href = "/login"
    }
  }, 5000)

  // Check session immediately on load
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      clearTimeout(timeout)
      fetchData(session)
    } else {
      clearTimeout(timeout)
      setPageLoading(false)
      window.location.href = "/login"
    }
  })

  // Also listen for auth state changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (_event, session) => {
      if (session) {
        clearTimeout(timeout)
        await fetchData(session)
      } else {
        clearTimeout(timeout)
        if (isMounted) {
          setPageLoading(false)
          window.location.href = "/login"
        }
      }
    }
  )

  return () => {
    isMounted = false
    clearTimeout(timeout)
    subscription.unsubscribe()
  }
}, [])

  const handleGenerate = async () => {
    if (!uploadedImage) return alert("Upload an image first")
    if (credits === 0) {
      setShowCreditPopup(true)
      return
    }

    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        window.location.href = "/login"
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
          genre,
          added_text: addedText,
        }),
      })

      const data = await res.json()

      if (data.image) {
        setCredits(data.credits_remaining)
        setGeneratedImage(data.image)

        setHistory(prev => [
          {
            id: crypto.randomUUID(),
            image_url: data.image,
            style: selectedStyle,
            genre,
            added_text: addedText,
            created_at: new Date().toISOString(),
          },
          ...prev,
        ])
      } else {
        alert("Generation failed: " + (data.error || "Unknown error"))
      }
    } catch (err) {
      console.error(err)
      alert("Generation failed.")
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const STYLES = [
    { value: "cartoon", label: "🎨 Cartoon" },
    { value: "anime", label: "⛩️ Anime" },
    { value: "fantasy", label: "🧙 Fantasy" },
    { value: "epic", label: "⚔️ Epic" },
    { value: "scifi", label: "🚀 Sci-Fi" },
    { value: "cute", label: "🌸 Cute" },
  ]

  // ✅ Loading screen (prevents flicker/logout bug)
  if (pageLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f0f1a] text-white">
        <p className="text-lg font-bold">🚀 Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Out of Credits Popup */}
      {showCreditPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-8 max-w-md w-full flex flex-col items-center gap-5 text-center">
            <div className="text-6xl">⚡</div>
            <h2 className="text-2xl font-black text-white">Out of Credits!</h2>
            <p className="text-white/50 text-sm leading-relaxed">
              You have used all your credits. Purchase a plan to keep generating amazing Roblox thumbnails.
            </p>
            <Link
              href="/pricing"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black text-lg hover:opacity-90 transition shadow-lg shadow-orange-500/20"
            >
              🚀 Purchase Credits
            </Link>
            <button
              onClick={() => setShowCreditPopup(false)}
              className="text-white/30 text-sm hover:text-white/60 transition"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/10 sticky top-0 bg-[#0f0f1a]/80 backdrop-blur-sm z-40">
        <Link href="/">
          <span className="text-2xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent">
            ROPIX
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
            <span className="text-yellow-400 text-sm">⚡</span>
            <span className="text-sm font-bold">
              {credits !== null ? `${credits} Credits` : "..."}
            </span>
          </div>
          {userEmail && (
            <span className="text-white/30 text-sm hidden md:block">
              {userEmail}
            </span>
          )}
          <Link
            href="/pricing"
            className="text-sm text-yellow-400 font-semibold hover:text-yellow-300 transition hidden md:block"
          >
            Buy Credits
          </Link>
          <button
            onClick={handleSignOut}
            className="text-sm text-white/30 hover:text-white transition"
          >
            Sign out
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 flex flex-col gap-8">
        {/* Generator */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-black mb-6">
            🎮 Generate{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Thumbnail
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Upload */}
            <div className="flex flex-col gap-3">
              <label className="text-xs text-white/40 uppercase tracking-widest font-bold">
                Screenshot
              </label>

              <label className="flex flex-col items-center justify-center h-52 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-yellow-400/40 transition bg-white/[0.02]">
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="preview"
                    className="w-full h-full object-contain rounded-xl"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-white/20">
                    <span className="text-4xl">📸</span>
                    <span className="text-xs">Click to upload PNG or JPG</span>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      const reader = new FileReader()
                      reader.onload = (ev) =>
                        setUploadedImage(ev.target?.result as string)
                      reader.readAsDataURL(e.target.files[0])
                    }
                  }}
                />
              </label>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest font-bold block mb-3">
                  Style
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {STYLES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setSelectedStyle(s.value)}
                      className={`py-2 px-3 rounded-xl text-sm font-semibold border transition ${
                        selectedStyle === s.value
                          ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-transparent shadow-lg shadow-orange-500/20"
                          : "bg-white/5 border-white/10 text-white/60 hover:border-yellow-400/30"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest font-bold block mb-2">
                  Genre
                </label>

                <input
                  type="text"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  placeholder="e.g. RPG, Obby, Simulator"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-yellow-400/50 transition text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest font-bold block mb-1">
                  Thumbnail Prompt{" "}
                  <span className="text-white/20 normal-case font-normal">
                    (Optional)
                  </span>
                </label>

                <p className="text-xs text-white/20 mb-2">
                  Describe the vibe, scene or mood you want
                </p>

                <input
                  type="text"
                  value={addedText}
                  onChange={(e) => setAddedText(e.target.value)}
                  placeholder="e.g. Epic battle scene, dramatic lighting"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-yellow-400/50 transition text-sm"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className={`mt-auto w-full py-3.5 rounded-xl font-black text-lg transition ${
                  loading
                    ? "bg-white/5 text-white/20 cursor-not-allowed"
                    : "bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:opacity-90 shadow-lg shadow-orange-500/20"
                }`}
              >
                {loading ? "⚙️ Generating..." : "⚡ Generate (1 Credit)"}
              </button>
            </div>
          </div>
        </div>

        {/* Editor */}
        {generatedImage && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-black mb-6">
              ✏️ Edit{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Thumbnail
              </span>
            </h2>
            <ThumbnailEditor imageUrl={generatedImage} />
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div>
            <h2 className="text-2xl font-black mb-6">
              🕹️{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                History
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setGeneratedImage(item.image_url)}
                  className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-yellow-400/30 transition cursor-pointer group"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={item.image_url}
                      alt="generated"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  </div>

                  <div className="p-3 flex flex-col gap-1.5">
                    <div className="flex gap-2 flex-wrap">
                      <span className="text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-2 py-0.5 rounded-full font-bold">
                        {item.style}
                      </span>

                      {item.genre && (
                        <span className="text-xs bg-white/5 text-white/40 border border-white/10 px-2 py-0.5 rounded-full">
                          {item.genre}
                        </span>
                      )}
                    </div>

                    {item.added_text && (
                      <p className="text-xs text-white/30 truncate">
                        "{item.added_text}"
                      </p>
                    )}

                    <p className="text-xs text-white/15">
                      Click to edit →
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

