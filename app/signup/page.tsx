"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSignup = async () => {
    if (!email || !password) return alert("Please fill in all fields")
    if (password.length < 6) return alert("Password must be at least 6 characters")
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) alert(error.message)
    else setDone(true)
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center px-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col gap-5">

        <div className="text-center mb-2">
          <Link href="/">
            <span className="text-4xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent">
              ROPIX
            </span>
          </Link>
          <p className="text-white/40 text-sm mt-1">Create your free account</p>
        </div>

        {done ? (
          <div className="text-center flex flex-col gap-4">
            <div className="text-5xl">📧</div>
            <h2 className="text-xl font-bold text-white">Check your email!</h2>
            <p className="text-white/50 text-sm">We sent a confirmation link to <strong className="text-yellow-400">{email}</strong>. Click it to activate your account.</p>
            <Link href="/login" className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black text-center hover:opacity-90 transition">
              Go to Login
            </Link>
          </div>
        ) : (
          <>
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
                placeholder="Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-yellow-400/50 transition"
              />
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black text-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Creating account..." : "🎮 Create Account"}
            </button>

            <p className="text-center text-white/40 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-yellow-400 font-semibold hover:underline">
                Log in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}