import Link from "next/link"

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white">
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

      <nav className="flex items-center justify-between px-8 py-4 border-b border-white/10 sticky top-0 bg-[#0f0f1a]/80 backdrop-blur-sm z-50">
        <Link href="/">
          <span className="text-2xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent">
            ROPIX
          </span>
        </Link>
        <Link href="/" className="text-sm text-white/40 hover:text-white transition">
          Back to Home
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16 flex flex-col gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2">Refund Policy</h1>
          <p className="text-white/40 text-sm">Last updated: April 1, 2025</p>
        </div>

        {[
          {
            title: "1. Our Refund Commitment",
            content: "At Ropix, we want you to be completely satisfied with our service. We offer a fair refund policy to ensure you can try our service with confidence."
          },
          {
            title: "2. 7-Day Money Back Guarantee",
            content: "If you are not satisfied with your subscription for any reason, you may request a full refund within 7 days of your initial purchase. This applies to first-time subscribers only. To request a refund, contact us at support@ropix.xyz within 7 days of your purchase date."
          },
          {
            title: "3. Renewal Refunds",
            content: "For subscription renewals, refund requests must be made within 48 hours of the renewal charge. After 48 hours, renewal charges are non-refundable. We recommend cancelling your subscription before the renewal date if you no longer wish to use the service."
          },
          {
            title: "4. Non-Refundable Items",
            content: "Credits that have already been used to generate thumbnails are non-refundable. Partial refunds for unused credits within a billing period are not provided except in cases covered by our 7-day guarantee or at our sole discretion."
          },
          {
            title: "5. How to Request a Refund",
            content: "To request a refund, email us at support@ropix.xyz with your account email address, the date of purchase, and the reason for your refund request. We will process your request within 3-5 business days. Approved refunds will be credited back to your original payment method."
          },
          {
            title: "6. Cancellation vs Refund",
            content: "Cancelling your subscription stops future charges but does not automatically trigger a refund for the current billing period. If you wish to cancel and receive a refund, please contact us directly at support@ropix.xyz."
          },
          {
            title: "7. Exceptions",
            content: "We reserve the right to refuse refunds in cases of abuse of our refund policy, accounts found to be in violation of our Terms of Service, or fraudulent activity. We also reserve the right to offer refunds or credits at our discretion in cases not covered by this policy."
          },
          {
            title: "8. Contact Us",
            content: "For any refund related questions or requests, please contact us at support@ropix.xyz. We aim to respond to all refund requests within 24 hours."
          },
        ].map((section) => (
          <div key={section.title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-lg font-black mb-3 text-yellow-400">{section.title}</h2>
            <p className="text-white/60 text-sm leading-relaxed">{section.content}</p>
          </div>
        ))}
      </div>

      <footer className="border-t border-white/5 py-8 px-8 text-center">
        <div className="flex gap-6 justify-center text-sm text-white/30 flex-wrap">
          <Link href="/privacy" className="hover:text-white/60 transition">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white/60 transition">Terms of Service</Link>
          <Link href="/refund" className="hover:text-white/60 transition">Refund Policy</Link>
          <Link href="/" className="hover:text-white/60 transition">Home</Link>
        </div>
      </footer>
    </div>
  )
}
