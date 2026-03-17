import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client (server-side)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Make sure you have a Service Role key in .env.local
)

export async function POST(req: Request) {
  try {
    // 1️⃣ Parse request
    const { style } = await req.json()

    // 2️⃣ Get Supabase access token from Authorization header
    const authHeader = req.headers.get("Authorization") || ""
    const token = authHeader.replace("Bearer ", "")

    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // 3️⃣ Fetch user's current credits
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("image_credits")
      .eq("id", user.id)
      .single()

    if (profileError || profile.image_credits === 0) {
      return NextResponse.json({ error: "No credits left" }, { status: 403 })
    }

    // 4️⃣ Deduct 1 credit immediately
    await supabase
      .from("profiles")
      .update({ image_credits: profile.image_credits - 1 })
      .eq("id", user.id)

    // 5️⃣ Call Replicate API
    const startResponse = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: process.env.REPLICATE_MODEL_VERSION, // Add your version ID in .env.local
        input: {
          prompt: `Roblox game thumbnail, ${style} style, vibrant colors, cinematic lighting, high detail`,
        },
      }),
    })

    let prediction = await startResponse.json()
    if (startResponse.status !== 201) {
      console.error("Replicate start error:", prediction)
      return NextResponse.json({ error: prediction.detail || "Failed to start AI" }, { status: 500 })
    }

    // 6️⃣ Poll until finished
    while (prediction.status !== "succeeded" && prediction.status !== "failed") {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const pollResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          },
        }
      )

      prediction = await pollResponse.json()
    }

    if (prediction.status === "succeeded") {
      return NextResponse.json({
        image: prediction.output[0],
        credits_remaining: profile.image_credits - 1,
      })
    } else {
      return NextResponse.json(
        { error: "Image generation failed" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}