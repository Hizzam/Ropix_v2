import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white overflow-hidden">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent">
            ROPIX
          </span>
          <span className="text-xs bg-yellow-400 text-black font-bold px-2 py-0.5 rounded-full">BETA</span>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="px-5 py-2 rounded-full border border-white/20 text-sm font-semibold hover:bg-white/10 transition">
            Login
          </Link>
          <Link href="/signup" className="px-5 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-bold hover:opacity-90 transition">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center text-center px-6 pt-24 pb-20">
        {/* Glow blobs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-4xl">
          <span className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-semibold text-yellow-300">
            🎮 Made for Roblox Creators
          </span>

          <h1 className="text-6xl md:text-7xl font-black leading-tight">
            Generate{" "}
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent">
              Epic Thumbnails
            </span>
            <br />
            in Seconds
          </h1>

          <p className="text-lg text-white/60 max-w-xl leading-relaxed">
            Upload your Roblox screenshot, pick a style, and let AI generate a stunning game thumbnail. Add text, download, and you're done.
          </p>

          <div className="flex gap-4 mt-2">
            <Link
              href="/signup"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black text-lg hover:scale-105 transition-transform shadow-lg shadow-orange-500/30"
            >
              🚀 Start Free
            </Link>
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-full border border-white/20 font-semibold text-lg hover:bg-white/10 transition"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-12">
          How It{" "}
          <span className="bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
            Works
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: "01", emoji: "📸", title: "Upload Screenshot", desc: "Take a screenshot of your Roblox game and upload it to Ropix." },
            { step: "02", emoji: "🤖", title: "AI Generates Art", desc: "Our AI transforms your screenshot into a stunning cinematic thumbnail." },
            { step: "03", emoji: "✏️", title: "Edit & Download", desc: "Add text, customize the style, and download your 1920×1080 thumbnail." },
          ].map((item) => (
            <div key={item.step} className="relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-yellow-400/40 transition">
              <span className="text-5xl font-black text-white/5 absolute top-4 right-4">{item.step}</span>
              <div className="text-4xl mb-3">{item.emoji}</div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-4">
          Simple{" "}
          <span className="bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
            Pricing
          </span>
        </h2>
        <p className="text-center text-white/50 mb-12">Credits refill every month automatically</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Basic",
              price: "$9.99",
              credits: "5 Credits",
              color: "from-blue-500 to-cyan-400",
              features: ["5 AI thumbnails/month", "1920×1080 export", "Text editor", "All styles"],
              popular: false,
            },
            {
              name: "Pro",
              price: "$19.99",
              credits: "25 Credits",
              color: "from-yellow-400 to-orange-500",
              features: ["25 AI thumbnails/month", "1920×1080 export", "Text editor", "All styles", "Priority generation"],
              popular: true,
            },
            {
              name: "Elite",
              price: "$49.99",
              credits: "100 Credits",
              color: "from-pink-500 to-purple-500",
              features: ["100 AI thumbnails/month", "1920×1080 export", "Text editor", "All styles", "Priority generation", "Early access features"],
              popular: false,
            },
          ].map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white/5 border rounded-2xl p-6 flex flex-col gap-4 ${plan.popular ? "border-yellow-400 scale-105" : "border-white/10"}`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-black px-4 py-1 rounded-full">
                  MOST POPULAR
                </span>
              )}
              <div className={`text-2xl font-black bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                {plan.name}
              </div>
              <div className="flex items-end gap-1">
                <span className="text-4xl font-black">{plan.price}</span>
                <span className="text-white/40 mb-1">/month</span>
              </div>
              <div className={`text-sm font-bold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                {plan.credits} per month
              </div>
              <ul className="flex flex-col gap-2 mt-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                    <span className="text-green-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`mt-auto w-full text-center py-3 rounded-full font-bold text-sm bg-gradient-to-r ${plan.color} text-black hover:opacity-90 transition`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-white/30 text-sm">
        <span className="font-black text-white/50">ROPIX</span> © 2025 — AI Thumbnail Generator for Roblox
      </footer>
    </div>
  )
}