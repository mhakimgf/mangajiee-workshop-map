import Link from "next/link";
import { Wrench, MapPin, Award, Compass, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col justify-between">
      {/* Navbar */}
      <header className="h-16 border-b border-iron px-6 flex items-center justify-between bg-charcoal/90 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-mustard to-amber-700 flex items-center justify-center text-obsidian shadow-lg shadow-mustard/20">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="font-display font-extrabold text-lg tracking-wider text-cream">
            MANGAJIEE <span className="text-mustard">MAP</span>
          </span>
          <span className="text-[10px] font-bold bg-graphite text-golden px-2 py-0.5 rounded border border-mustard/30 uppercase tracking-widest">
            Curated
          </span>
        </div>

        <nav className="flex items-center gap-4">
          <Link
            href="/map"
            className="inline-flex items-center gap-2 bg-mustard hover:bg-golden text-obsidian px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md shadow-mustard/20"
          >
            <Compass className="w-4 h-4" />
            Buka Peta Bengkel
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-graphite/60 border border-iron text-xs text-ash mb-8">
          <span className="w-2 h-2 rounded-full bg-olive animate-pulse" />
          <span>Fase MVP Aktif · 50+ Bengkel Terpilih di Bandung</span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-cream leading-tight mb-6">
          Find the <span className="text-mustard">right workshop</span>, <br className="hidden sm:block" />
          not just the nearest one.
        </h1>

        <p className="text-ash text-base sm:text-lg max-w-2xl mb-10 leading-relaxed">
          Platform peta interaktif terkurasi manual oleh tim Mangajiee. Temukan spesialis kaki-kaki, BMW, kelistrikan, hingga AC yang benar-benar layak dipercaya.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/map"
            className="inline-flex items-center justify-center gap-2 bg-mustard hover:bg-golden text-obsidian px-6 py-3.5 rounded-xl font-bold text-base transition-all shadow-xl shadow-mustard/25"
          >
            <Compass className="w-5 h-5" />
            Jelajahi Workshop Map
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/recommended"
            className="inline-flex items-center justify-center gap-2 bg-charcoal hover:bg-graphite border border-iron text-cream px-6 py-3.5 rounded-xl font-semibold text-base transition-all"
          >
            <Award className="w-5 h-5 text-mustard" />
            Pilihan Mangajiee
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-iron py-6 px-6 text-center text-xs text-smoke">
        © 2026 Mangajiee Media. All rights reserved. Built for automotive enthusiasts & vehicle owners.
      </footer>
    </main>
  );
}
