import type { Metadata, Viewport } from 'next'
import { Caveat, DM_Sans, Fredoka } from 'next/font/google'
import './globals.css'

const fredoka = Fredoka({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-fredoka' })
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '700', '800'], variable: '--font-dm-sans' })
const caveat = Caveat({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-caveat' })

export const metadata: Metadata = {
  title: 'Confetti',
  description: 'A photo booth for your loved ones far apart. One strip, two phones, any time zone.',
  manifest: '/manifest.json',
  icons: { apple: '/apple-touch-icon.png' },
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Confetti' },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#FFF7EC',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fredoka.variable} ${dmSans.variable} ${caveat.variable}`}>
      <body>{children}</body>
    </html>
  )
}
