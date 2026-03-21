import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Ropix",
  description: "AI Thumbnail Generator for Roblox",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&family=Nunito:wght@400;700;900&family=Oswald:wght@400;700&family=Patrick+Hand&family=Fredoka+One&family=Bangers&family=Arimo:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}