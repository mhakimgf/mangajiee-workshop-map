import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, MapPin, Wrench, MessageCircle, Navigation, Award, CheckCircle } from "lucide-react";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return {
    title: `Detail Workshop — ${params.slug} | Mangajiee`,
    description: "Detail kurasi bengkel otomotif terverifikasi tim Mangajiee.",
  };
}

export default function WorkshopDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-obsidian text-cream">
      {/* Navbar */}
      <header className="h-16 border-b border-iron px-6 flex items-center justify-between bg-charcoal/90 sticky top-0 z-50">
        <Link href="/map" className="inline-flex items-center gap-2 text-sm text-ash hover:text-cream">
          <ChevronLeft className="w-4 h-4" />
          Kembali ke Peta
        </Link>
        <span className="font-display font-bold text-sm text-mustard">MANGAJIEE CURATED</span>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-charcoal border border-iron rounded-2xl overflow-hidden p-6 sm:p-8">
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-mustard to-amber-600 text-obsidian px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5" />
            Mangajiee Recommended
          </div>

          <h1 className="font-display text-2xl sm:text-4xl font-extrabold text-cream mb-2 capitalize">
            {params.slug.replace(/-/g, " ")}
          </h1>

          <div className="flex items-center gap-2 text-sm text-ash mb-6">
            <MapPin className="w-4 h-4 text-mustard" />
            <span>Kota Bandung, Jawa Barat</span>
          </div>

          {/* Curator Blockquote */}
          <div className="bg-obsidian/70 border-l-4 border-mustard p-5 rounded-r-xl my-6">
            <div className="text-xs font-bold text-mustard uppercase tracking-wider mb-2">
              Why Mangajiee Recommends It
            </div>
            <p className="italic text-sm sm:text-base text-cream/90 leading-relaxed">
              &quot;Bengkel spesialis dengan standar pengerjaan teruji, mekanik senior berintegritas tinggi, dan transparansi biaya sebelum tindakan bongkar mesin/kaki-kaki.&quot;
            </p>
            <div className="text-xs text-golden font-semibold mt-3">
              — Tim Kurator Otomotif Mangajiee
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-iron">
            <button className="flex-1 inline-flex items-center justify-center gap-2 bg-mustard hover:bg-golden text-obsidian px-6 py-3.5 rounded-xl font-bold text-sm transition-all">
              <MessageCircle className="w-4 h-4" />
              Konsultasi WhatsApp
            </button>
            <button className="flex-1 inline-flex items-center justify-center gap-2 bg-graphite hover:bg-iron border border-iron text-cream px-6 py-3.5 rounded-xl font-semibold text-sm transition-all">
              <Navigation className="w-4 h-4" />
              Petunjuk Arah Google Maps
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
