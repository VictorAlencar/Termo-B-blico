import type { Metadata, Viewport } from "next";
import { Cinzel, Spectral } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
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

// Aplica o tema salvo (data-theme) antes da pintura para evitar flash
const themeScript = `(function(){try{var t=localStorage.getItem("tb-theme");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      data-theme="light"
      data-palette="pergaminho"
      suppressHydrationWarning
      className={`${cinzel.variable} ${spectral.variable} h-full`}
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
