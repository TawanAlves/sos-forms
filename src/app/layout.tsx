import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { EnvironmentProvider } from "@/components/EnvironmentProvider";
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
  title: "SOS Palmilhas - Formulário",
  description: "Sistema de pedidos para palmilhas personalizadas",
  keywords: ["palmilhas", "personalizadas", "ortopédicas", "SOS", "palmilhas 3d"],
  authors: [{ name: "SOS Palmilhas" }],
  creator: "Codei Tecnologia",
  publisher: "SOS Palmilhas",
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
    ],
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <EnvironmentProvider>
          {children}
        </EnvironmentProvider>
      </body>
    </html>
  );
}
