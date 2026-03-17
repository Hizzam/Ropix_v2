"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      alert("Check your email to confirm signup.")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col gap-4 w-80">
        <h1 className="text-2xl font-bold">Sign Up</h1>
        <input
          className="border p-2"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border p-2"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-black text-white p-2"
          onClick={handleSignup}
        >
          Sign Up
        </button>
      </div>
    </div>
  )
}