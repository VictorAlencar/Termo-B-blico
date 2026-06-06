import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Termo Bíblico",
    short_name: "Termo Bíblico",
    description:
      "Descubra a palavra bíblica do dia em até 6 tentativas.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3ead4",
    theme_color: "#7d2533",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
