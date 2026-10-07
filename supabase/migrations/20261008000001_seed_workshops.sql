-- ============================================================
-- SEED DATA: 20261008000001_seed_workshops.sql
-- MANGAJIEE WORKSHOP MAP — Sample Curated Bandung Workshops
-- ============================================================

-- 1. Seed Areas
INSERT INTO areas (id, name, slug, city, latitude, longitude) VALUES
('a0000000-0000-0000-0000-000000000001', 'Dago', 'dago', 'Bandung', -6.8856, 107.6145),
('a0000000-0000-0000-0000-000000000002', 'Pasir Kaliki', 'pasir-kaliki', 'Bandung', -6.9082, 107.6012),
('a0000000-0000-0000-0000-000000000003', 'Buah Batu', 'buah-batu', 'Bandung', -6.9465, 107.6258),
('a0000000-0000-0000-0000-000000000004', 'Soekarno Hatta', 'soekarno-hatta', 'Bandung', -6.9535, 107.6432),
('a0000000-0000-0000-0000-000000000005', 'Pasteur', 'pasteur', 'Bandung', -6.8923, 107.5842)
ON CONFLICT (slug) DO NOTHING;

-- 2. Seed Specializations
INSERT INTO specializations (id, name, slug, category, icon, description) VALUES
('s0000000-0000-0000-0000-000000000001', 'Kaki-Kaki & Understeel', 'kaki-kaki', 'mechanical', 'wrench', 'Perbaikan tierod, bushing, shockbreaker, dan racksteer'),
('s0000000-0000-0000-0000-000000000002', 'BMW Specialist', 'bmw-specialist', 'brand', 'shield', 'Perawatan dan perbaikan komprehensif mobil BMW'),
('s0000000-0000-0000-0000-000000000003', 'AC & Climate Control', 'ac-cooling', 'comfort', 'snowflake', 'Flushing freon, kompresor, evaporator, dan kondensor'),
('s0000000-0000-0000-0000-000000000004', 'Electrical & ECU Remap', 'electrical-ecu', 'electrical', 'zap', 'Diagnostik kelistrikan, tuning ECU, dan scanning OBD'),
('s0000000-0000-0000-0000-000000000005', 'Body Repair & Cat Oven', 'body-paint', 'aesthetic', 'palette', 'Pengecatan oven standar pabrik dan repair tabrakan')
ON CONFLICT (slug) DO NOTHING;

-- 3. Seed Vehicles
INSERT INTO vehicles (id, name, slug, brand, vehicle_type) VALUES
('v0000000-0000-0000-0000-000000000001', 'BMW', 'bmw', 'BMW', 'car'),
('v0000000-0000-0000-0000-000000000002', 'Mercedes-Benz', 'mercedes-benz', 'Mercedes-Benz', 'car'),
('v0000000-0000-0000-0000-000000000003', 'Toyota', 'toyota', 'Toyota', 'car'),
('v0000000-0000-0000-0000-000000000004', 'Honda', 'honda', 'Honda', 'car')
ON CONFLICT (slug) DO NOTHING;

-- 4. Seed Workshops
INSERT INTO workshops (
    id, name, slug, address, area_id, latitude, longitude, phone_wa, gmaps_url,
    is_recommended, recommendation_reason, status, submission_source
) VALUES
(
    'w0000000-0000-0000-0000-000000000001',
    'Auto Prima European Specialist',
    'auto-prima-european-specialist',
    'Jl. Ir. H. Juanda No. 182, Dago, Bandung',
    'a0000000-0000-0000-0000-000000000001',
    -6.8856, 107.6145,
    '6281223456789',
    'https://maps.google.com/?q=-6.8856,107.6145',
    true,
    'Spesialis BMW & Mercedes-Benz paling rapi di Dago. Teknisi bersertifikasi ex-dealer resmi. Alat scan diagnostik OEM lengkap, sangat transparan sebelum bongkar suku cadang.',
    'approved', 'admin'
),
(
    'w0000000-0000-0000-0000-000000000002',
    'Bengkel Kaki-Kaki Sinar Maju',
    'sinar-maju-kaki-kaki',
    'Jl. Pasir Kaliki No. 94, Bandung',
    'a0000000-0000-0000-0000-000000000002',
    -6.9082, 107.6012,
    '6281334567890',
    'https://maps.google.com/?q=-6.9082,107.6012',
    true,
    'Jawara problem racksteer bunyi dan bushing arm oblak. Mengutamakan perbaikan presisi bubut daripada langsung vonis ganti gelondongan mahal. Hasil pengerjaan senyap dan tahan banting.',
    'approved', 'admin'
)
ON CONFLICT (slug) DO NOTHING;

-- 5. Seed Junction Relations
INSERT INTO workshop_specializations (workshop_id, specialization_id) VALUES
('w0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000002'),
('w0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000001'),
('w0000000-0000-0000-0000-000000000002', 's0000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;
