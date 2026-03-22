import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const PLAN_CREDITS: Record<string, number> = {
  [process.env.POLAR_BASIC_PRODUCT_ID!]: 5,
  [process.env.POLAR_PRO_PRODUCT_ID!]: 25,
  [process.env.POLAR_ELITE_PRODUCT_ID!]: 100,
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { type, data } = body

    console.log("Polar webhook received:", type)

    // Handle successful subscription or order
    if (type === "subscription.created" || type === "order.created") {
      const customerEmail = data?.customer?.email || data?.user?.email
      const productId = data?.productId || data?.product?.id

      if (!customerEmail || !productId) {
        console.error("Missing email or productId", { customerEmail, productId })
        return NextResponse.json({ error: "Missing data" }, { status: 400 })
      }

      const credits = PLAN_CREDITS[productId]
      if (!credits) {
        console.error("Unknown productId:", productId)
        return NextResponse.json({ error: "Unknown product" }, { status: 400 })
      }

      // Find user by email
      const { data: users, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", (
          await supabase.auth.admin.listUsers()
        ).data.users.find(u => u.email === customerEmail)?.id || "")
        .single()

      if (userError || !users) {
        // Try finding via auth users directly
        const { data: authUsers } = await supabase.auth.admin.listUsers()
        const user = authUsers.users.find(u => u.email === customerEmail)

        if (!user) {
          console.error("User not found:", customerEmail)
          return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        // Update credits
        await supabase
          .from("profiles")
          .update({ image_credits: credits })
          .eq("id", user.id)

        console.log(`Updated ${customerEmail} to ${credits} credits`)
      }
    }

    // Handle monthly renewal — reset credits
    if (type === "subscription.active") {
      const customerEmail = data?.customer?.email
      const productId = data?.product?.id

      if (customerEmail && productId) {
        const credits = PLAN_CREDITS[productId]
        if (credits) {
          const { data: authUsers } = await supabase.auth.admin.listUsers()
          const user = authUsers.users.find(u => u.email === customerEmail)
          if (user) {
            await supabase
              .from("profiles")
              .update({ image_credits: credits })
              .eq("id", user.id)
            console.log(`Renewed ${customerEmail} to ${credits} credits`)
          }
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}