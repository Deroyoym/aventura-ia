import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "La Hora Trece",
    short_name: "Hora Trece",
    description: "Un cuento de bruma para dos. Juego de rol narrativo cooperativo.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b0c16",
    theme_color: "#0b0c16",
    lang: "es",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
