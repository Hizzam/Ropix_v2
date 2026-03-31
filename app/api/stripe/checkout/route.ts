import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const PRICE_IDS: Record<string, string> = {
  basic: process.env.STRIPE_BASIC_PRICE_ID!,
  pro: process.env.STRIPE_PRO_PRICE_ID!,
  elite: process.env.STRIPE_ELITE_PRICE_ID!,
}

export async function POST(req: Request) {
  try {
    const { plan, userEmail } = await req.json()

    const priceId = PRICE_IDS[plan]
    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: userEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing?payment=cancelled`,
    })

    return NextResponse.json({ checkoutUrl: session.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 })
  }
}