import { NextResponse } from "next/server"
import { Polar } from "@polar-sh/sdk"

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
})

const PRODUCT_IDS: Record<string, string> = {
  basic: process.env.POLAR_BASIC_PRODUCT_ID!,
  pro: process.env.POLAR_PRO_PRODUCT_ID!,
  elite: process.env.POLAR_ELITE_PRODUCT_ID!,
}

export async function POST(req: Request) {
  try {
    const { plan, userEmail } = await req.json()

    const productId = PRODUCT_IDS[plan]
    if (!productId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const checkout = await polar.checkouts.create({
  products: [productId],
  successUrl: `${process.env.POLAR_SUCCESS_URL}`,
  customerEmail: userEmail,
})

    return NextResponse.json({ checkoutUrl: checkout.url })
  } catch (error) {
    console.error("Polar checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 })
  }
}