import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Corisa AI - AI-Native Development System',
  description: 'Transform English descriptions into complete applications. The revolutionary abstract coding platform that no one has ever experienced.',
  keywords: ['AI', 'development', 'code generation', 'YAML', 'abstract coding', 'Corisa'],
  authors: [{ name: 'Corisa AI Team' }],
  creator: 'Corisa AI',
  publisher: 'Corisa AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://corisa.ai'),
  openGraph: {
    title: 'Corisa AI - Revolutionary Abstract Coding Platform',
    description: 'Transform English descriptions into complete applications with AI-native development.',
    url: 'https://corisa.ai',
    siteName: 'Corisa AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Corisa AI Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Corisa AI - Revolutionary Abstract Coding Platform',
    description: 'Transform English descriptions into complete applications with AI-native development.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          {children}
        </div>
      </body>
    </html>
  )
}