import React from 'react';
import type { Metadata, Viewport } from 'next';
import { DM_Sans } from 'next/font/google';
import '../styles/tailwind.css';
import 'leaflet/dist/leaflet.css';
import { Toaster } from 'sonner';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ffffff',
};

export const metadata: Metadata = {
  title: 'PHYTO-SENTINELLE — Surveillance Phytosanitaire PALMCI',
  description: 'Système de surveillance phytosanitaire des plantations PALMCI — Groupe SIFCA.',
  manifest: '/manifest.json',
  icons: { icon: [{ url: '/favicon.ico', type: 'image/x-icon' }] },
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'PALMCI Phyto' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${dmSans.variable}`}>
      <body className={`${dmSans.className} bg-background text-foreground antialiased`}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#ffffff',
              border: '1px solid #d4e0d8',
              color: '#1a1a1a',
              borderRadius: '8px',
              fontSize: '13px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            },
          }}
        />
      </body>
    </html>
  );
}
