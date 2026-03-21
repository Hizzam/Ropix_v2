"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) return alert("Please enter email and password")
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) alert(error.message)
    else router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center px-4">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col gap-5">

        {/* Logo */}
        <div className="text-center mb-2">
          <Link href="/">
            <span className="text-4xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent">
              ROPIX
            </span>
          </Link>
          <p className="text-white/40 text-sm mt-1">Welcome back! Log in to your account</p>
        </div>

        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/50 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/50 transition"
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black text-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "🚀 Login"}
        </button>

        <p className="text-center text-white/40 text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className="text-yellow-400 font-semibold hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  )
}