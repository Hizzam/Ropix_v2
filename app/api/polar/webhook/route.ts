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
    console.log("Webhook data:", JSON.stringify(data, null, 2))

    if (
      type === "subscription.created" ||
      type === "order.created" ||
      type === "subscription.active"
    ) {
      const customerEmail =
        data?.customer?.email ||
        data?.user?.email ||
        data?.subscription?.customer?.email

      const productId =
        data?.productId ||
        data?.product?.id ||
        data?.subscription?.product?.id ||
        data?.items?.[0]?.product?.id

      console.log("Customer email:", customerEmail)
      console.log("Product ID:", productId)

      if (!customerEmail || !productId) {
        console.error("Missing email or productId")
        return NextResponse.json({ error: "Missing data" }, { status: 400 })
      }

      const credits = PLAN_CREDITS[productId]
      if (!credits) {
        console.error("Unknown productId:", productId)
        return NextResponse.json({ error: "Unknown product" }, { status: 400 })
      }

      // Find user by email
      const { data: authUsers } = await supabase.auth.admin.listUsers()
      const user = authUsers?.users?.find(u => u.email === customerEmail)

      if (!user) {
        console.error("User not found:", customerEmail)
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      // Update credits
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ image_credits: credits })
        .eq("id", user.id)

      if (updateError) {
        console.error("Failed to update credits:", updateError)
        return NextResponse.json({ error: "Failed to update credits" }, { status: 500 })
      }

      console.log(`Successfully updated ${customerEmail} to ${credits} credits`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}