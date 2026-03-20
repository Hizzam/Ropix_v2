import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Supabase server client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  let userId: string | null = null // ✅ for refund

  try {
    const { style, genre, added_text } = await req.json()

    // Get user from access token
    const authHeader = req.headers.get("Authorization") || ""
    const token = authHeader.replace("Bearer ", "")
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    userId = user.id // ✅ store for refund

    // 🧠 SAFE CREDIT DEDUCTION (atomic)
    const { data: success, error: creditError } = await supabase.rpc("decrement_credit", {
      user_id: user.id,
    })

    if (creditError || !success) {
      return NextResponse.json({ error: "No credits left" }, { status: 403 })
    }

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

      // 🔥 REFUND if start fails
      await supabase.rpc("increment_credit", {
        user_id: user.id,
      })

      return NextResponse.json(
        { error: prediction.detail || "Failed to start AI" },
        { status: 500 }
      )
    }

    // Poll until finished
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

      // ✅ Get updated credits
      const { data: updatedProfile } = await supabase
        .from("profiles")
        .select("image_credits")
        .eq("id", user.id)
        .single()

      return NextResponse.json({
        image: imageUrl,
        credits_remaining: updatedProfile?.image_credits ?? 0,
      })
    } else {
      // 🔥 REFUND if generation fails
      await supabase.rpc("increment_credit", {
        user_id: user.id,
      })

      return NextResponse.json(
        { error: "Image generation failed (credit refunded)" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Server error:", error)

    // 🔥 FINAL SAFETY REFUND
    if (userId) {
      try {
        await supabase.rpc("increment_credit", {
          user_id: userId,
        })
      } catch (refundError) {
        console.error("Refund failed:", refundError)
      }
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}