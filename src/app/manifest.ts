import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Termo Bíblico",
    short_name: "Termo Bíblico",
    description:
      "Descubra a palavra bíblica do dia em até 6 tentativas.",
    start_url: "/",
    display: "standalone",
    background_color: "#181614",
    theme_color: "#3aa394",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
