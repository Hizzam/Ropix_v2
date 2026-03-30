import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white overflow-x-hidden">

      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-[#0f0f1a]/80">
        <div className="flex items-center gap-2">
          <span className="text-xl md:text-2xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent">
            ROPIX
          </span>
          <span className="text-xs border border-yellow-400/40 text-yellow-400 font-bold px-2 py-0.5 rounded-full">BETA</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm text-white/50 hover:text-white transition">How It Works</a>
          <a href="#gallery" className="text-sm text-white/50 hover:text-white transition">Gallery</a>
          <a href="#pricing" className="text-sm text-white/50 hover:text-white transition">Pricing</a>
          <a href="#faq" className="text-sm text-white/50 hover:text-white transition">FAQ</a>
        </div>
        <div className="flex gap-2">
          <Link href="/login" className="px-3 md:px-5 py-2 rounded-full border border-white/10 text-sm font-semibold hover:bg-white/5 transition text-white/70">
            Login
          </Link>
          <Link href="/signup" className="px-3 md:px-5 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-black hover:opacity-90 transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative flex flex-col items-center text-center px-4 md:px-6 pt-16 md:pt-28 pb-16 md:pb-24">
        <div className="relative z-10 flex flex-col items-center gap-5 max-w-4xl w-full">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-yellow-400/20 bg-yellow-400/5 text-yellow-300 text-xs md:text-sm font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            AI-Powered · Built for Roblox Creators
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
            Turn Screenshots into{" "}
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent">
              Epic Thumbnails
            </span>
          </h1>
          <p className="text-base md:text-lg text-white/50 max-w-xl leading-relaxed">
            Upload your Roblox screenshot, pick a style, and our AI generates a stunning 1920x1080 thumbnail in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-2 w-full sm:w-auto">
            <Link
              href="/signup"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black text-base md:text-lg hover:scale-105 transition-transform shadow-xl shadow-orange-500/25 text-center"
            >
              🚀 Start Free Today
            </Link>

            {/* ✅ FIXED HERE */}
            <a
              href="#how-it-works"
              className="px-8 py-3.5 rounded-full border border-white/10 font-semibold text-base md:text-lg hover:bg-white/5 transition text-white/60 text-center"
            >
              See How It Works
            </a>
          </div>

          <div className="grid grid-cols-2 md:flex md:gap-10 gap-6 mt-8 pt-8 border-t border-white/5 w-full md:w-auto">
            {[
              { val: "1920x1080", label: "Export Resolution" },
              { val: "6+", label: "Art Styles" },
              { val: "Under 30s", label: "Generation Time" },
              { val: "100%", label: "Roblox Focused" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-xl md:text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">{s.val}</div>
                <div className="text-xs text-white/30 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* rest of your file unchanged */}
    </div>
  )
}