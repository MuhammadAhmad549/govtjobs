import type { Metadata } from 'next'
import AdSenseLoader from './Components/AdSenseLoader'
import './globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://govtjobs-omega.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Government Jobs Pakistan | FPSC, PPSC, FIA, FBR, NJP',
    template: '%s | GovtJobs Pakistan'
  },
  description:
    'Find Pakistan government jobs from official sources including FPSC, FIA, FBR, PPSC, Punjab Jobs, and the National Jobs Portal. Listings refresh from public portals.',
  applicationName: 'GovtJobs Pakistan',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: siteUrl,
    siteName: 'Government Jobs Pakistan',
    title: 'Government Jobs Pakistan',
    description:
      'Verified-style government job listings for Pakistan with links back to official department portals.'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Government Jobs Pakistan',
    description: 'Browse government vacancies linked to official FPSC, FIA, FBR, and NJP sources.'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-full flex flex-col">
        <AdSenseLoader />
        {children}
      </body>
    </html>
  )
}
