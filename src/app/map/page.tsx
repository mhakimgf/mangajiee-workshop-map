import { Metadata } from "next";
import Link from "next/link";
import { Wrench, ChevronLeft, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Interactive Workshop Map — Mangajiee",
  description: "Peta interaktif bengkel terkurasi di Bandung.",
};

export default function MapPage() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-obsidian">
      {/* Top Navbar */}
      <header className="h-14 border-b border-iron px-4 flex items-center justify-between bg-charcoal z-20 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-ash hover:text-cream flex items-center gap-1 text-xs">
            <ChevronLeft className="w-4 h-4" />
            Home
          </Link>
          <div className="h-4 w-[1px] bg-iron" />
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-mustard" />
            <span className="font-display font-bold text-sm text-cream">MANGAJIEE MAP</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-ash bg-graphite/60 border border-iron px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-olive" />
          <span>Kota Bandung</span>
        </div>
      </header>

      {/* Main Split Layout Container */}
      <div className="flex-1 flex flex-col md:flex-row relative overflow-hidden">
        {/* Left Sidebar (Workshop List & Filters) */}
        <aside className="w-full md:w-[460px] bg-charcoal border-r border-iron flex flex-col z-10">
          <div className="p-4 border-b border-iron">
            <input
              type="text"
              placeholder="Cari bengkel, spesialisasi (kaki-kaki, BMW)..."
              className="w-full bg-graphite border border-iron rounded-lg px-3 py-2 text-sm text-cream placeholder-smoke focus:outline-none focus:border-mustard"
            />
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="text-xs text-ash mb-3">Memuat workshop terkurasi...</div>
            <div className="bg-graphite/40 border border-iron rounded-xl p-4 text-center text-ash text-sm">
              Untuk demonstrasi prototype interaktif penuh, silakan buka{" "}
              <a href="/mockup" className="text-mustard underline font-medium">
                Prototype Mockup
              </a>
            </div>
          </div>
        </aside>

        {/* Right Map Canvas Container */}
        <main className="flex-1 bg-obsidian-pure relative">
          <div className="absolute inset-0 flex items-center justify-center text-ash text-sm">
            <div className="text-center">
              <MapPin className="w-8 h-8 text-mustard mx-auto mb-2 opacity-80" />
              <p>Leaflet Map Container</p>
              <p className="text-xs text-smoke mt-1">Google Maps Roadmap / CARTO Dark Tiles</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
