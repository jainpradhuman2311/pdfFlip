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
  title: "DocuVault - Modern Document Viewer",
  description: "Experience seamless document viewing with our modern interface. Browse PDFs, images, and Office documents directly from Google Drive with stunning visual clarity.",
  generator: "DocuVault",
  keywords: ["PDF viewer", "document viewer", "Google Drive", "modern UI", "file manager"],
  authors: [{ name: "DocuVault Team" }],
  openGraph: {
    title: "DocuVault - Modern Document Viewer",
    description: "Experience seamless document viewing with our modern interface",
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
