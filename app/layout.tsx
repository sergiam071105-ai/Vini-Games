import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { PropsWithChildren } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://vinigames.vercel.app'),
  title: {
    default: 'ViniGames | Tienda Oficial de Videojuegos y Comunidad Gamer',
    template: '%s | ViniGames',
  },
  description:
    'Descubre, compra y juega los mejores títulos para PC y consolas al mejor precio en Bolivianos (Bs.). Gamificación, IA con ViniChat y entregas digitales inmediatas.',
  keywords: [
    'ViniGames',
    'Videojuegos Bolivia',
    'Tienda Gamer',
    'Comprar Juegos Bolivianos',
    'ViniChat IA',
    'Nintendo Switch Bolivia',
    'Steam PC Games',
  ],
  icons: {
    icon: [
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'ViniGames | Tienda Oficial de Videojuegos',
    description: 'Catálogo de videojuegos legendarios con precios en Bolivianos y asistencia de IA.',
    url: 'https://vinigames.vercel.app',
    siteName: 'ViniGames',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'ViniGames Logo',
      },
    ],
    locale: 'es_BO',
    type: 'website',
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
