"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

const DISCORD_LINK = "https://discord.gg/CP4AqfHA"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) setIsLoggedIn(true)
    }
    checkSession()
  }, [])

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white overflow-hidden">

      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-[#0f0f1a]/80">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent">
            ROPIX
          </span>
          <span className="text-xs border border-yellow-400/40 text-yellow-400 font-bold px-2 py-0.5 rounded-full">BETA</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm text-white/50 hover:text-white transition">How It Works</a>
          <a href="#gallery" className="text-sm text-white/50 hover:text-white transition">Gallery</a>
          <a href="#pricing" className="text-sm text-white/50 hover:text-white transition">Pricing</a>
          <a href="#faq" className="text-sm text-white/50 hover:text-white transition">FAQ</a>
          <a href={DISCORD_LINK} target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-white transition flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
            Discord
          </a>
        </div>
        <div className="flex gap-3">
          {isLoggedIn ? (
            <Link href="/dashboard" className="px-5 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-black hover:opacity-90 transition shadow-lg shadow-orange-500/20">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="px-5 py-2 rounded-full border border-white/10 text-sm font-semibold hover:bg-white/5 transition text-white/70">
                Login
              </Link>
              <Link href="/signup" className="px-5 py-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-sm font-black hover:opacity-90 transition shadow-lg shadow-orange-500/20">
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="relative flex flex-col items-center text-center px-6 pt-28 pb-24">
        <div className="relative z-10 flex flex-col items-center gap-6 max-w-4xl">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-400/20 bg-yellow-400/5 text-yellow-300 text-sm font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
            AI-Powered · Built for Roblox Creators
          </div>
          <h1 className="text-6xl md:text-7xl font-black leading-tight tracking-tight">
            Turn Screenshots into{" "}
            <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent">
              Epic Thumbnails
            </span>
          </h1>
          <p className="text-lg text-white/50 max-w-xl leading-relaxed">
            Upload your Roblox screenshot, pick a style, and our AI generates a stunning 1920x1080 thumbnail in seconds. Add text, customize, and download.
          </p>
          <div className="flex gap-4 mt-2 flex-wrap justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black text-lg hover:scale-105 transition-transform shadow-xl shadow-orange-500/25"
            >
              Start Free Today
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 rounded-full border border-white/10 font-semibold text-lg hover:bg-white/5 transition text-white/60"
            >
              See How It Works
            </a>
          </div>
          <div className="flex gap-10 mt-10 pt-10 border-t border-white/5 flex-wrap justify-center">
            {[
              { val: "1920x1080", label: "Export Resolution" },
              { val: "6+", label: "Art Styles" },
              { val: "Under 30s", label: "Generation Time" },
              { val: "100%", label: "Roblox Focused" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">{s.val}</div>
                <div className="text-xs text-white/30 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="px-6 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs text-yellow-400 font-black tracking-widest uppercase mb-3">How It Works</p>
          <h2 className="text-4xl md:text-5xl font-black">
            Three steps to a{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
              perfect thumbnail
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              emoji: "📸",
              title: "Upload Your Screenshot",
              desc: "Take any screenshot from your Roblox game and upload it directly to Ropix. PNG and JPG supported.",
            },
            {
              step: "02",
              emoji: "🤖",
              title: "AI Generates the Art",
              desc: "Our AI transforms your screenshot into a stunning cinematic thumbnail in your chosen style — cartoon, anime, epic and more.",
            },
            {
              step: "03",
              emoji: "✏️",
              title: "Edit, Customize and Download",
              desc: "Add text with custom fonts and colors, drag to reposition, resize — then download your 1920x1080 thumbnail ready for Roblox.",
            },
          ].map((item) => (
            <div key={item.step} className="relative bg-white/5 border border-white/10 rounded-2xl p-7 hover:border-yellow-400/30 transition group">
              <span className="text-7xl font-black text-white/[0.04] absolute top-4 right-5 group-hover:text-yellow-400/10 transition">{item.step}</span>
              <div className="text-4xl mb-4">{item.emoji}</div>
              <h3 className="text-xl font-black mb-2">{item.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="px-6 py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-yellow-400 font-black tracking-widest uppercase mb-3">Gallery</p>
            <h2 className="text-4xl md:text-5xl font-black">
              Thumbnails made{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
                with Ropix
              </span>
            </h2>
            <p className="text-white/30 mt-3 text-sm">Real AI-generated thumbnails across different styles</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { style: "Epic", genre: "RPG", color: "from-orange-500 to-red-600" },
              { style: "Anime", genre: "Adventure", color: "from-pink-500 to-purple-600" },
              { style: "Cartoon", genre: "Obby", color: "from-yellow-400 to-orange-500" },
              { style: "Sci-Fi", genre: "Shooter", color: "from-cyan-400 to-blue-600" },
              { style: "Fantasy", genre: "Simulator", color: "from-purple-400 to-pink-600" },
              { style: "Cute", genre: "Tycoon", color: "from-green-400 to-cyan-500" },
            ].map((item) => (
              <div key={item.style} className="relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden group hover:border-yellow-400/30 transition aspect-video flex items-center justify-center">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-20 group-hover:opacity-30 transition`} />
                <div className="relative z-10 text-center">
                  <div className="text-4xl font-black text-white/80">{item.style}</div>
                  <div className="text-sm text-white/40 mt-1">{item.genre}</div>
                </div>
                <div className="absolute bottom-3 right-3">
                  <span className="text-xs bg-white/10 border border-white/10 text-white/50 px-2 py-0.5 rounded-full">AI Generated</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-white/20 text-xs mt-6">
            Gallery will show real generated thumbnails once your first users start creating
          </p>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-6 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs text-yellow-400 font-black tracking-widest uppercase mb-3">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-black">
            Simple,{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
              transparent pricing
            </span>
          </h2>
          <p className="text-white/30 mt-3 text-sm">Credits refill automatically every month · Cancel anytime</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {[
            {
              name: "Basic",
              price: "$9.99",
              credits: "5 Credits",
              color: "from-blue-400 to-cyan-500",
              border: "border-white/10",
              btn: "bg-white/5 border border-white/10 hover:bg-white/10 text-white",
              scale: "",
              popular: false,
              features: ["5 AI thumbnails/month", "1920x1080 export", "Full text editor", "All 6 art styles", "Download PNG"],
            },
            {
              name: "Pro",
              price: "$19.99",
              credits: "25 Credits",
              color: "from-yellow-400 to-orange-500",
              border: "border-yellow-400/50",
              btn: "bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black shadow-lg shadow-orange-500/20",
              scale: "scale-105",
              popular: true,
              features: ["25 AI thumbnails/month", "1920x1080 export", "Full text editor", "All 6 art styles", "Download PNG", "Priority generation"],
            },
            {
              name: "Elite",
              price: "$49.99",
              credits: "100 Credits",
              color: "from-pink-500 to-purple-600",
              border: "border-white/10",
              btn: "bg-white/5 border border-white/10 hover:bg-white/10 text-white",
              scale: "",
              popular: false,
              features: ["100 AI thumbnails/month", "1920x1080 export", "Full text editor", "All 6 art styles", "Download PNG", "Priority generation", "Early access to new tools"],
            },
          ].map((plan) => (
            <div key={plan.name} className={`relative bg-white/5 border ${plan.border} rounded-2xl p-7 flex flex-col gap-5 ${plan.scale}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-black px-5 py-1.5 rounded-full shadow-lg shadow-orange-500/30 whitespace-nowrap">
                  MOST POPULAR
                </div>
              )}
              <div>
                <div className={`text-lg font-black bg-gradient-to-r ${plan.color} bg-clip-text text-transparent mb-1`}>{plan.name}</div>
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-black text-white">{plan.price}</span>
                  <span className="text-white/30 mb-2">/month</span>
                </div>
                <div className={`text-sm font-bold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>{plan.credits} per month</div>
              </div>
              <ul className="flex flex-col gap-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-white/60">
                    <span className="text-green-400 text-xs font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className={`w-full text-center py-3.5 rounded-xl font-bold text-sm transition ${plan.btn}`}>
                Get Started
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center text-white/20 text-xs mt-8">
          All plans include a free trial credit · No credit card required to sign up
        </p>
      </section>

      {/* DISCORD COMMUNITY */}
      <section className="px-6 py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="text-indigo-400">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
          </div>
          <p className="text-xs text-yellow-400 font-black tracking-widest uppercase">Community</p>
          <h2 className="text-4xl md:text-5xl font-black">
            Join the{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
              Ropix Community
            </span>
          </h2>
          <p className="text-white/50 max-w-lg leading-relaxed">
            Connect with other Roblox developers, share your thumbnails, get feedback, and stay updated on new features. The founder is active daily.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mt-2">
            {[
              { emoji: "🎨", title: "Share Thumbnails", desc: "Show off your AI generated thumbnails and get feedback" },
              { emoji: "💡", title: "Shape the Product", desc: "Your feedback directly influences what gets built next" },
              { emoji: "🚀", title: "Early Access", desc: "Be first to know about new features and tools" },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 border border-white/10 rounded-xl p-4 text-left">
                <div className="text-2xl mb-2">{item.emoji}</div>
                <div className="font-bold text-sm text-white mb-1">{item.title}</div>
                <div className="text-xs text-white/40 leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
          <a
            href={DISCORD_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg transition shadow-xl shadow-indigo-500/25"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
            Join Discord Community
          </a>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 py-24 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-yellow-400 font-black tracking-widest uppercase mb-3">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-black">
              Loved by{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
                Roblox creators
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "xBloxDev",
                role: "Roblox Game Developer",
                avatar: "xB",
                color: "from-yellow-400 to-orange-500",
                text: "My game went from 50 visits a day to over 2,000 after I updated my thumbnail using Ropix. The AI quality is insane for the price.",
              },
              {
                name: "DevMaster99",
                role: "Obby Creator",
                avatar: "DM",
                color: "from-pink-400 to-purple-500",
                text: "I used to spend hours in Photoshop making thumbnails. Now it takes me 30 seconds. Ropix is a game changer for solo developers.",
              },
              {
                name: "RobloxRacer",
                role: "Simulator Developer",
                avatar: "RR",
                color: "from-cyan-400 to-blue-500",
                text: "The text editor is so easy to use and the fonts look super professional. My thumbnails finally look like a big studio made them.",
              },
            ].map((t) => (
              <div key={t.name} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 hover:border-yellow-400/20 transition">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-black font-black text-sm`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">{t.name}</div>
                    <div className="text-xs text-white/30">{t.role}</div>
                  </div>
                  <div className="ml-auto text-yellow-400 text-sm">★★★★★</div>
                </div>
                <p className="text-white/50 text-sm leading-relaxed">&quot;{t.text}&quot;</p>
              </div>
            ))}
          </div>
          <p className="text-center text-white/20 text-xs mt-6">
            Testimonials will be replaced with real reviews from your first users
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-24 max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs text-yellow-400 font-black tracking-widest uppercase mb-3">FAQ</p>
          <h2 className="text-4xl md:text-5xl font-black">
            Common{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
              questions
            </span>
          </h2>
        </div>
        <div className="flex flex-col gap-4">
          {[
            { q: "What is a credit?", a: "One credit = one AI generated thumbnail. Each time you click Generate, one credit is used. Credits refill automatically on your monthly billing date." },
            { q: "What image size does Ropix export?", a: "All thumbnails are exported at 1920x1080 pixels — the exact recommended size for Roblox game thumbnails." },
            { q: "Do unused credits roll over?", a: "No, credits reset each month. We recommend choosing a plan that matches how many thumbnails you create per month." },
            { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time. You keep your remaining credits until the end of the billing period." },
            { q: "What styles are available?", a: "Currently Ropix supports 6 styles — Cartoon, Anime, Fantasy, Epic, Sci-Fi and Cute. More styles are coming soon." },
            { q: "Does Ropix work on mobile?", a: "Ropix is best used on desktop since the thumbnail editor requires mouse interaction. Mobile support is coming in a future update." },
            { q: "Will you add more tools?", a: "Yes! Ropix is growing into a full Swiss Army Knife for Roblox developers. Game icons, logos, UI assets and more are planned." },
          ].map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-yellow-400/20 transition">
              <h3 className="font-black text-white mb-2">{item.q}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="px-6 py-20 max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-r from-yellow-400/10 to-pink-500/10 border border-yellow-400/20 rounded-3xl p-12 flex flex-col items-center gap-6">
          <h2 className="text-4xl md:text-5xl font-black">
            Ready to level up{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
              your game?
            </span>
          </h2>
          <p className="text-white/40 max-w-md">
            Join Roblox creators using Ropix to make thumbnails that actually get clicks.
          </p>
          <Link
            href="/signup"
            className="px-10 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black text-xl hover:scale-105 transition-transform shadow-xl shadow-orange-500/25"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent">
              ROPIX
            </span>
            <span className="text-white/20 text-sm">AI Thumbnail Generator for Roblox</span>
          </div>
          <div className="flex gap-6 text-sm text-white/30 flex-wrap justify-center items-center">
            <a href={DISCORD_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
              </svg>
              Discord
            </a>
            <Link href="/privacy" className="hover:text-white/60 transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/60 transition">Terms of Service</Link>
            <Link href="/refund" className="hover:text-white/60 transition">Refund Policy</Link>
          </div>
          <p className="text-white/20 text-xs">© 2025 Ropix · All rights reserved</p>
        </div>
      </footer>

    </div>
  )
}
