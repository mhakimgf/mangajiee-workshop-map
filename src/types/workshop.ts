export type WorkshopStatus = "draft" | "pending" | "approved" | "archived";
export type VehicleType = "car" | "motorcycle";

export interface Workshop {
  id: string;
  name: string;
  slug: string;
  address: string;
  area_id?: string;
  area_name?: string;
  latitude: number;
  longitude: number;
  phone_wa: string;
  gmaps_url?: string;
  is_recommended: boolean;
  recommendation_reason?: string;
  curated_by?: string;
  status: WorkshopStatus;
  submission_source: "admin" | "owner_submission";
  specializations?: string[];
  vehicle_brands?: string[];
  photos?: string[];
  distance?: string;
  created_at: string;
  updated_at: string;
}

export interface Specialization {
  id: string;
  name: string;
  slug: string;
  category: string;
  icon?: string;
  description?: string;
}

export interface Area {
  id: string;
  name: string;
  slug: string;
  city: string;
  latitude?: number;
  longitude?: number;
}
