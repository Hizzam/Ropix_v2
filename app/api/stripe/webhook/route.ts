import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const PLAN_CREDITS: Record<string, number> = {
  [process.env.STRIPE_BASIC_PRICE_ID!]: 5,
  [process.env.STRIPE_PRO_PRICE_ID!]: 25,
  [process.env.STRIPE_ELITE_PRICE_ID!]: 100,
}

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error("Webhook signature error:", error)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "invoice.payment_succeeded"
    ) {
      let customerEmail: string | null = null
      let priceId: string | null = null

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session
        customerEmail = session.customer_email
        const fullSession = await stripe.checkout.sessions.retrieve(
          session.id,
          { expand: ["line_items"] }
        )
        priceId = fullSession.line_items?.data[0]?.price?.id ?? null
      } else if (event.type === "invoice.payment_succeeded") {
        const invoice = event.data.object as Stripe.Invoice
        customerEmail = invoice.customer_email
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        priceId = (invoice.lines.data[0] as any)?.price?.id ?? null
      }

      if (!customerEmail || !priceId) {
        console.error("Missing email or priceId")
        return NextResponse.json({ error: "Missing data" }, { status: 400 })
      }

      const credits = PLAN_CREDITS[priceId]
      if (!credits) {
        console.error("Unknown priceId:", priceId)
        return NextResponse.json({ received: true })
      }

      const { data: authUsers } = await supabase.auth.admin.listUsers()
      const user = authUsers?.users?.find(u => u.email === customerEmail)

      if (!user) {
        console.error("User not found:", customerEmail)
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      await supabase
        .from("profiles")
        .update({ image_credits: credits })
        .eq("id", user.id)

      console.log(`Updated ${customerEmail} to ${credits} credits`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}