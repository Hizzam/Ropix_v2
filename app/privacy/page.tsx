import Link from "next/link"

export default function PrivacyPolicy() {
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
          <h1 className="text-4xl font-black mb-2">Privacy Policy</h1>
          <p className="text-white/40 text-sm">Last updated: April 1, 2025</p>
        </div>

        {[
          {
            title: "1. Information We Collect",
            content: "We collect information you provide directly to us, such as your email address when you create an account or sign in with Google. We also collect information about how you use our service, including the screenshots you upload and thumbnails you generate."
          },
          {
            title: "2. How We Use Your Information",
            content: "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions. We do not sell your personal information to third parties."
          },
          {
            title: "3. Information Sharing",
            content: "We do not share your personal information with third parties except as described in this policy. We may share your information with service providers who assist us in operating our website, including Supabase for database storage and authentication, Stripe for payment processing, and Replicate for AI image generation."
          },
          {
            title: "4. Data Storage and Security",
            content: "Your data is stored securely using Supabase. Images you upload are used solely for generating thumbnails and are not stored permanently on our servers. Generated thumbnails are stored and accessible through your account history. We implement appropriate security measures to protect your personal information."
          },
          {
            title: "5. Cookies",
            content: "We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent."
          },
          {
            title: "6. Third Party Services",
            content: "Our service integrates with third party services including Google for authentication, Stripe for payment processing, and Replicate for AI image generation. These services have their own privacy policies and we encourage you to review them."
          },
          {
            title: "7. Children's Privacy",
            content: "Our service is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us."
          },
          {
            title: "8. Changes to This Policy",
            content: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the date at the top."
          },
          {
            title: "9. Contact Us",
            content: "If you have any questions about this Privacy Policy, please contact us at support@ropix.xyz"
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
