import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const { customerEmail } = await req.json()

    if (!customerEmail) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    // Find customer by email in Stripe
    const customers = await stripe.customers.list({ email: customerEmail, limit: 1 })

    if (customers.data.length === 0) {
      return NextResponse.json({ error: "No subscription found for this account" }, { status: 404 })
    }

    const customerId = customers.data[0].id

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Portal error:", error)
    return NextResponse.json({ error: "Failed to open subscription portal" }, { status: 500 })
  }
}