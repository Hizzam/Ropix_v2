import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Supabase server client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { style, genre, added_text } = await req.json()

    // Get user from access token
    const authHeader = req.headers.get("Authorization") || ""
    const token = authHeader.replace("Bearer ", "")
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // Fetch user's credits
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("image_credits")
      .eq("id", user.id)
      .single()

    if (profileError || profile.image_credits === 0) {
      return NextResponse.json({ error: "No credits left" }, { status: 403 })
    }

    // Deduct 1 credit
    await supabase
      .from("profiles")
      .update({ image_credits: profile.image_credits - 1 })
      .eq("id", user.id)

    // Build prompt including text and genre
    let prompt = `Roblox game thumbnail, ${style} style, vibrant colors, cinematic lighting, high detail`
    if (genre) prompt += `, genre: ${genre}`
    if (added_text) prompt += `, include text: "${added_text}"`

    // Call Replicate API
    const startResponse = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: process.env.REPLICATE_MODEL_VERSION,
        input: { prompt },
      }),
    })

    let prediction = await startResponse.json()
    if (startResponse.status !== 201) {
      console.error("Replicate start error:", prediction)
      return NextResponse.json({ error: prediction.detail || "Failed to start AI" }, { status: 500 })
    }

    // Poll until finished
    while (prediction.status !== "succeeded" && prediction.status !== "failed") {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const pollResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        { headers: { Authorization: `Token ${process.env.REPLICATE_API_TOKEN}` } }
      )
      prediction = await pollResponse.json()
    }

    if (prediction.status === "succeeded") {
      const imageUrl = prediction.output[0]

      // Save to history table
      await supabase.from("generated_images").insert([
        {
          user_id: user.id,
          image_url: imageUrl,
          style,
          genre,
          added_text,
        },
      ])

      return NextResponse.json({
        image: imageUrl,
        credits_remaining: profile.image_credits - 1,
      })
    } else {
      return NextResponse.json({ error: "Image generation failed" }, { status: 500 })
    }
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}