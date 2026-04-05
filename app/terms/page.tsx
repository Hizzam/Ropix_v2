import Link from "next/link"

export default function TermsOfService() {
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
          <h1 className="text-4xl font-black mb-2">Terms of Service</h1>
          <p className="text-white/40 text-sm">Last updated: April 1, 2025</p>
        </div>

        {[
          {
            title: "1. Acceptance of Terms",
            content: "By accessing and using Ropix (ropix.xyz), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service."
          },
          {
            title: "2. Description of Service",
            content: "Ropix is an AI-powered thumbnail generator for Roblox game developers. Users can upload screenshots of their Roblox games and our AI will generate professional thumbnails. The service operates on a credit-based subscription model where credits are used to generate thumbnails."
          },
          {
            title: "3. User Accounts",
            content: "You must create an account to use our service. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account."
          },
          {
            title: "4. Subscriptions and Credits",
            content: "Ropix offers monthly subscription plans that include a set number of credits. Credits are used to generate AI thumbnails — one credit per generation. Credits reset at the beginning of each billing cycle and do not roll over to the next month. Unused credits expire at the end of each billing period."
          },
          {
            title: "5. Payment Terms",
            content: "Subscriptions are billed monthly. Payment is processed securely through Stripe. By subscribing, you authorize us to charge your payment method on a recurring monthly basis until you cancel. Prices are listed in USD and may be subject to local taxes."
          },
          {
            title: "6. Cancellation",
            content: "You may cancel your subscription at any time through the Manage Subscription option in your dashboard. Upon cancellation, you will retain access to your subscription benefits until the end of the current billing period. No partial refunds are provided for unused portions of a billing period unless covered by our refund policy."
          },
          {
            title: "7. User Content",
            content: "You retain ownership of the screenshots you upload and the thumbnails you generate. By using our service, you grant us a limited license to process your uploaded images solely for the purpose of generating thumbnails. You are responsible for ensuring you have the right to use any content you upload."
          },
          {
            title: "8. Prohibited Uses",
            content: "You agree not to use Ropix for any unlawful purpose, to upload content that infringes on intellectual property rights, to attempt to reverse engineer or hack our service, to use our service to generate harmful or offensive content, or to resell or redistribute our service without permission."
          },
          {
            title: "9. Disclaimer of Warranties",
            content: "Ropix is provided on an as-is and as-available basis. We make no warranties, expressed or implied, regarding the reliability, accuracy, or availability of our service. We do not guarantee that the service will be uninterrupted or error-free."
          },
          {
            title: "10. Limitation of Liability",
            content: "To the maximum extent permitted by law, Ropix shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service."
          },
          {
            title: "11. Changes to Terms",
            content: "We reserve the right to modify these terms at any time. We will notify users of significant changes by posting a notice on our website. Your continued use of the service after changes constitutes acceptance of the new terms."
          },
          {
            title: "12. Contact",
            content: "If you have any questions about these Terms of Service, please contact us at support@ropix.xyz"
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
