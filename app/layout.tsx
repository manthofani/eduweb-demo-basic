import './globals.css'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import Layout from '../components/Layout'

export const metadata: Metadata = {
  title: 'EduWeb',
  description: 'Frontend LMS demo'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='id'>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Layout>
          <div className='fade-in'>{children}</div>
        </Layout>
        <Analytics />
      </body>
    </html>
  )
}
