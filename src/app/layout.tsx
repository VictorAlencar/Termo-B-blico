import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export const metadata: Metadata = {
  title: {
    default: "Termo Bíblico — descubra a palavra bíblica do dia",
    template: "%s | Termo Bíblico",
  },
  description:
    "Jogo diário de palavras com temática bíblica. Descubra a palavra do dia em até 6 tentativas, acompanhe suas estatísticas e crie desafios para compartilhar com os amigos.",
  keywords: [
    "termo",
    "wordle",
    "bíblia",
    "jogo bíblico",
    "palavra do dia",
    "jogo de palavras",
  ],
  openGraph: {
    title: "Termo Bíblico",
    description:
      "Descubra a palavra bíblica do dia em até 6 tentativas. Jogue agora!",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// Aplica o tema salvo antes da pintura para evitar flash
const themeScript = `(function(){try{var t=localStorage.getItem("tb-theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-screen flex-col">
        {children}
        {ADSENSE_CLIENT_ID && (
          <Script
            id="adsense"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        )}
      </body>
    </html>
  );
}
