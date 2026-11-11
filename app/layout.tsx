import type { Metadata, Viewport } from "next";
import "@fontsource/im-fell-english-sc/latin-400.css";
import "@fontsource/im-fell-english/latin-400.css";
import "@fontsource/im-fell-english/latin-400-italic.css";
import "@fontsource-variable/eb-garamond/wght.css";
import "@fontsource-variable/eb-garamond/wght-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "La Hora Trece",
  description: "Un cuento de bruma para dos. Juego de rol narrativo cooperativo con un máster de IA.",
  applicationName: "La Hora Trece",
  appleWebApp: { capable: true, title: "La Hora Trece", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0c16",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div className="bruma" aria-hidden />
        {children}
      </body>
    </html>
  );
}
