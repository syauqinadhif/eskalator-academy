import type { Metadata } from 'next'
import { DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
import ProgressSync from '@/components/ProgressSync'

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ESKALATOR Academy',
  description: 'Game-based Python learning platform. Master the code behind the ESKALATOR ICU monitoring system.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="scanlines min-h-full flex flex-col antialiased">
        <AuthProvider>
          <ProgressSync />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
