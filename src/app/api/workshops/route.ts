import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") || "all";
  const search = searchParams.get("q") || "";

  // Stub response for API endpoint testing & schema verification
  const sampleWorkshops = [
    {
      id: "ws-1",
      name: "Auto Prima European Specialist",
      slug: "auto-prima-european-specialist",
      area: "Dago, Bandung Utara",
      latitude: -6.8856,
      longitude: 107.6145,
      is_recommended: true,
      recommendation_reason: "Spesialis BMW & Mercedes-Benz paling rapi di Dago. Teknisi bersertifikasi ex-dealer resmi.",
      status: "approved",
    },
    {
      id: "ws-2",
      name: "Bengkel Kaki-Kaki Sinar Maju",
      slug: "sinar-maju-kaki-kaki",
      area: "Pasir Kaliki, Bandung Pusat",
      latitude: -6.9082,
      longitude: 107.6012,
      is_recommended: true,
      recommendation_reason: "Jawara problem racksteer bunyi dan bushing arm oblak. Mengutamakan perbaikan presisi bubut.",
      status: "approved",
    },
  ];

  return NextResponse.json({
    status: "success",
    count: sampleWorkshops.length,
    data: sampleWorkshops,
  });
}
