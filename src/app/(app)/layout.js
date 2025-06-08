import Header from '@/components/Header'
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import "../globals.css"
import { Exo_2 } from 'next/font/google'

const exo2 = Exo_2({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-exo2',
})

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata = {
  title: 'My Voice Blueprint',
  description: 'My Voice Blueprint helps you design, manage, and personalize voice experiences with ease and precision.',
}

export default function RootLayout({
  children,
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${exo2.variable} ${exo2.variable} antialiased`}>
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}