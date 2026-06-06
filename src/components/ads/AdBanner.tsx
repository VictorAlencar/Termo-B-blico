"use client";

import { useEffect, useRef } from "react";

const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdBannerProps {
  /** ID do bloco de anúncio (data-ad-slot) criado no painel do AdSense */
  slot: string;
  format?: string;
  className?: string;
}

/**
 * Bloco de anúncio do Google AdSense.
 * Sem NEXT_PUBLIC_ADSENSE_CLIENT_ID configurado: mostra um placeholder em
 * desenvolvimento e não renderiza nada em produção.
 */
export function AdBanner({
  slot,
  format = "auto",
  className = "",
}: AdBannerProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!CLIENT_ID || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // bloqueador de anúncios ou script ainda não carregado
    }
  }, []);

  if (!CLIENT_ID) {
    if (process.env.NODE_ENV === "development") {
      return (
        <div className={`tb-ad ${className}`}>
          [Anúncio — configure NEXT_PUBLIC_ADSENSE_CLIENT_ID]
        </div>
      );
    }
    return null;
  }

  return (
    <ins
      className={`adsbygoogle block ${className}`}
      style={{ display: "block" }}
      data-ad-client={CLIENT_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
