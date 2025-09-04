import type React from "react"
import type { Metadata } from "next"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { DM_Sans } from "next/font/google"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "जैन ग्रंथ संग्रह - डिजिटल पुस्तकालय",
  description: "जैन धर्म के पवित्र ग्रंथों, हस्तलिखित पांडुलिपियों और प्रकाशित पुस्तकों का डिजिटल संग्रह। आगम सूत्र, स्तोत्र, कथा ग्रंथ और अन्य जैन साहित्य का अध्ययन करें।",
  generator: "जैन ग्रंथ संग्रह",
  keywords: ["जैन ग्रंथ", "जैन साहित्य", "आगम सूत्र", "हस्तलिखित पांडुलिपि", "जैन धर्म", "तत्त्वार्थ सूत्र", "कल्प सूत्र", "स्तोत्र"],
  authors: [{ name: "जैन ग्रंथ संग्रह टीम" }],
  openGraph: {
    title: "जैन ग्रंथ संग्रह - डिजिटल पुस्तकालय",
    description: "जैन धर्म के पवित्र ग्रंथों का डिजिटल संग्रह और अध्ययन मंच",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${dmSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Suspense fallback={null}>
            {children}
            <Analytics />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
