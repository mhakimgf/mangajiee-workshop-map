import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mangajiee Workshop Map — Find the Right Workshop",
  description: "Platform kurasi bengkel otomotif terpercaya di Bandung berdasarkan spesialisasi, jenis kendaraan, dan rekomendasi tim Mangajiee.",
  keywords: ["bengkel bandung", "bengkel mobil", "spesialis bmw", "kaki-kaki bandung", "mangajiee map"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-obsidian text-cream">
        {children}
      </body>
    </html>
  );
}
