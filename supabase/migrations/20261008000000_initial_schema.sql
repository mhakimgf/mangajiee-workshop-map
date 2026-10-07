-- ============================================================
-- MIGRATION: 20261008000000_initial_schema.sql
-- MANGAJIEE WORKSHOP MAP — Core PostgreSQL Schema with RLS
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Table: areas
CREATE TABLE IF NOT EXISTS areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(80) NOT NULL,
    slug VARCHAR(90) UNIQUE NOT NULL,
    city VARCHAR(80) NOT NULL DEFAULT 'Bandung',
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Table: specializations
CREATE TABLE IF NOT EXISTS specializations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(80) NOT NULL,
    slug VARCHAR(90) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    icon VARCHAR(50),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Table: vehicles
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(80) NOT NULL,
    slug VARCHAR(90) UNIQUE NOT NULL,
    brand VARCHAR(80),
    vehicle_type VARCHAR(20) NOT NULL CHECK (vehicle_type IN ('car', 'motorcycle')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Table: admin_profiles (terikat auth.users)
CREATE TABLE IF NOT EXISTS admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'curator' CHECK (role IN ('super_admin', 'curator')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Table: workshops (Entitas Utama)
CREATE TABLE IF NOT EXISTS workshops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(160) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    area_id UUID REFERENCES areas(id) ON DELETE SET NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    phone_wa VARCHAR(25) NOT NULL,
    gmaps_url TEXT,
    is_recommended BOOLEAN NOT NULL DEFAULT false,
    recommendation_reason TEXT,
    curated_by UUID REFERENCES admin_profiles(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'approved', 'archived')),
    submission_source VARCHAR(20) NOT NULL DEFAULT 'admin' CHECK (submission_source IN ('admin', 'owner_submission')),
    submitter_name VARCHAR(100),
    submitter_contact VARCHAR(50),
    operating_hours JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Junction Tables
CREATE TABLE IF NOT EXISTS workshop_specializations (
    workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
    specialization_id UUID REFERENCES specializations(id) ON DELETE CASCADE,
    PRIMARY KEY (workshop_id, specialization_id)
);

CREATE TABLE IF NOT EXISTS workshop_vehicles (
    workshop_id UUID REFERENCES workshops(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    PRIMARY KEY (workshop_id, vehicle_id)
);

-- 7. Table: workshop_photos
CREATE TABLE IF NOT EXISTS workshop_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    url TEXT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES FOR LATENCY < 100ms
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_workshops_coords ON workshops (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_workshops_status_recommended ON workshops (status, is_recommended);
CREATE INDEX IF NOT EXISTS idx_workshops_slug ON workshops (slug);
CREATE INDEX IF NOT EXISTS idx_specializations_slug ON specializations (slug);
CREATE INDEX IF NOT EXISTS idx_areas_slug ON areas (slug);
CREATE INDEX IF NOT EXISTS idx_workshops_area ON workshops (area_id);
CREATE INDEX IF NOT EXISTS idx_photos_workshop ON workshop_photos (workshop_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE specializations ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_photos ENABLE ROW LEVEL SECURITY;

-- 1. Workshops RLS
CREATE POLICY "Public can view approved workshops"
ON workshops FOR SELECT
USING (status = 'approved');

CREATE POLICY "Public can submit workshop"
ON workshops FOR INSERT
WITH CHECK (status = 'pending' AND submission_source = 'owner_submission');

CREATE POLICY "Admins have full access on workshops"
ON workshops FOR ALL
USING (auth.uid() IN (SELECT id FROM admin_profiles));

-- 2. Lookup Tables RLS
CREATE POLICY "Public read lookups" ON specializations FOR SELECT USING (true);
CREATE POLICY "Admin write lookups" ON specializations FOR ALL USING (auth.uid() IN (SELECT id FROM admin_profiles));

CREATE POLICY "Public read vehicles" ON vehicles FOR SELECT USING (true);
CREATE POLICY "Admin write vehicles" ON vehicles FOR ALL USING (auth.uid() IN (SELECT id FROM admin_profiles));

CREATE POLICY "Public read areas" ON areas FOR SELECT USING (true);
CREATE POLICY "Admin write areas" ON areas FOR ALL USING (auth.uid() IN (SELECT id FROM admin_profiles));

-- 3. Photos RLS
CREATE POLICY "Public read approved photos"
ON workshop_photos FOR SELECT
USING (workshop_id IN (SELECT id FROM workshops WHERE status = 'approved'));

CREATE POLICY "Admins full photo access"
ON workshop_photos FOR ALL
USING (auth.uid() IN (SELECT id FROM admin_profiles));
