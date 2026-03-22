"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) setUserEmail(session.user.email ?? null)
    }
    getUser()
  }, [])

  const handlePurchase = async (plan: string) => {
    if (!userEmail) {
      window.location.href = "/login"
      return
    }

    setLoading(plan)
    try {
      const res = await fetch("/api/polar/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, userEmail }),
      })

      const data = await res.json()

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      } else {
        alert("Failed to create checkout. Please try again.")
      }
    } catch (err) {
      console.error(err)
      alert("Something went wrong.")
    } finally {
      setLoading(null)
    }
  }

  const plans = [
    {
      id: "basic",
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
      id: "pro",
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
      id: "elite",
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
  ]

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/10 sticky top-0 bg-[#0f0f1a]/80 backdrop-blur-sm z-50">
        <Link href="/">
          <span className="text-2xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent">
            ROPIX
          </span>
        </Link>
        <Link href="/dashboard" className="text-sm text-white/40 hover:text-white transition">
          Back to Dashboard
        </Link>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <p className="text-xs text-yellow-400 font-black tracking-widest uppercase mb-3">Pricing</p>
          <h1 className="text-5xl font-black mb-4">
            Choose your{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
              plan
            </span>
          </h1>
          <p className="text-white/40">Credits refill automatically every month · Cancel anytime</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {plans.map((plan) => (
            <div key={plan.id} className={`relative bg-white/5 border ${plan.border} rounded-2xl p-7 flex flex-col gap-5 ${plan.scale}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-black px-5 py-1.5 rounded-full shadow-lg shadow-orange-500/30 whitespace-nowrap">
                  ⭐ MOST POPULAR
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
              <button
                onClick={() => handlePurchase(plan.id)}
                disabled={loading === plan.id}
                className={`w-full text-center py-3.5 rounded-xl font-bold text-sm transition ${plan.btn} disabled:opacity-50`}
              >
                {loading === plan.id ? "Redirecting..." : "Get Started"}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-white/20 text-xs mt-8">
          Secure payments powered by Polar.sh · No credit card stored on our servers
        </p>
      </div>
    </div>
  )
}