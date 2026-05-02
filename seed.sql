-- PhytoBox PALMCI – Seed Data pour Toumanguié
-- Données de test basées sur le fichier KML
-- Nécessite: CREATE EXTENSION postgis;

-- ============================================
-- TABLE: sentinelles (PhytoBox positions)
-- ============================================
CREATE TABLE IF NOT EXISTS sentinelles (
  id SERIAL PRIMARY KEY,
  code VARCHAR(20) UNIQUE NOT NULL,
  parcelle VARCHAR(10),
  nom VARCHAR(100),
  status VARCHAR(20) CHECK (status IN ('critique', 'orange', 'sain')),
  maladie_suspectee VARCHAR(50),
  geom GEOMETRY(POINT, 4326),
  risk_index INTEGER,
  cov_ppm INTEGER,
  acoustique INTEGER,
  humidite_sol INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index spatial
CREATE INDEX IF NOT EXISTS idx_sentinelles_geom ON sentinelles USING GIST(geom);

-- Insertion des sentinelles
INSERT INTO sentinelles (code, parcelle, nom, status, maladie_suspectee, geom, risk_index, cov_ppm, acoustique, humidite_sol) VALUES
  -- Alertes CRITIQUES (Rouge)
  ('SENT-01-06', 'P01', 'Sentinelle 01-06', 'critique', 'Ganoderma', ST_SetSRID(ST_MakePoint(-3.3880, 5.3615), 4326), 82, 845, 5200, 91),
  ('SENT-01-11', 'P01', 'Sentinelle 01-11', 'critique', 'Ganoderma', ST_SetSRID(ST_MakePoint(-3.3890, 5.3590), 4326), 78, 720, 4800, 88),
  ('SENT-02-03', 'P02', 'Sentinelle 02-03', 'critique', 'Phytophthora', ST_SetSRID(ST_MakePoint(-3.3855, 5.3625), 4326), 85, 920, 3500, 94),
  ('SENT-02-07', 'P02', 'Sentinelle 02-07', 'critique', 'Fusariose', ST_SetSRID(ST_MakePoint(-3.3840, 5.3625), 4326), 80, 680, 4100, 89),
  ('SENT-02-12', 'P02', 'Sentinelle 02-12', 'critique', 'Phytophthora', ST_SetSRID(ST_MakePoint(-3.3855, 5.3615), 4326), 83, 890, 3800, 92),

  -- Vigilance ORANGE
  ('SENT-02-01', 'P02', 'Sentinelle 02-01', 'orange', NULL, ST_SetSRID(ST_MakePoint(-3.3845, 5.3630), 4326), 55, 420, 2800, 72),
  ('SENT-02-05', 'P02', 'Sentinelle 02-05', 'orange', NULL, ST_SetSRID(ST_MakePoint(-3.3835, 5.3625), 4326), 52, 380, 2600, 68),
  ('SENT-02-09', 'P02', 'Sentinelle 02-09', 'orange', NULL, ST_SetSRID(ST_MakePoint(-3.3850, 5.3615), 4326), 58, 450, 3100, 75),
  ('SENT-02-15', 'P02', 'Sentinelle 02-15', 'orange', NULL, ST_SetSRID(ST_MakePoint(-3.3835, 5.3610), 4326), 48, 340, 2400, 65),
  ('SENT-05-04', 'P05', 'Sentinelle 05-04 (Lisière)', 'orange', NULL, ST_SetSRID(ST_MakePoint(-3.3880, 5.3560), 4326), 60, 520, 2900, 78),
  ('SENT-05-08', 'P05', 'Sentinelle 05-08 (Lisière)', 'orange', NULL, ST_SetSRID(ST_MakePoint(-3.3865, 5.3560), 4326), 56, 480, 2750, 74),
  ('SENT-05-14', 'P05', 'Sentinelle 05-14 (Lisière)', 'orange', NULL, ST_SetSRID(ST_MakePoint(-3.3870, 5.3550), 4326), 54, 440, 2650, 71),
  ('SENT-04-10', 'P04', 'Sentinelle 04-10', 'orange', NULL, ST_SetSRID(ST_MakePoint(-3.3850, 5.3580), 4326), 50, 360, 2500, 67),

  -- Sentinelles SAINES (Vert)
  ('SENT-03-00', 'P03', 'Sentinelle 03-00', 'sain', NULL, ST_SetSRID(ST_MakePoint(-3.3890, 5.3600), 4326), 25, 180, 1200, 45),
  ('SENT-03-04', 'P03', 'Sentinelle 03-04', 'sain', NULL, ST_SetSRID(ST_MakePoint(-3.3880, 5.3590), 4326), 22, 160, 1100, 42),
  ('SENT-03-08', 'P03', 'Sentinelle 03-08', 'sain', NULL, ST_SetSRID(ST_MakePoint(-3.3870, 5.3585), 4326), 28, 200, 1350, 48),
  ('SENT-06-02', 'P06', 'Sentinelle 06-02', 'sain', NULL, ST_SetSRID(ST_MakePoint(-3.3845, 5.3565), 4326), 20, 140, 1050, 40),
  ('SENT-06-06', 'P06', 'Sentinelle 06-06', 'sain', NULL, ST_SetSRID(ST_MakePoint(-3.3835, 5.3560), 4326), 24, 175, 1180, 44),
  ('SENT-07-03', 'P07', 'Sentinelle 07-03', 'sain', NULL, ST_SetSRID(ST_MakePoint(-3.3880, 5.3535), 4326), 18, 130, 980, 38),
  ('SENT-08-01', 'P08', 'Sentinelle 08-01', 'sain', NULL, ST_SetSRID(ST_MakePoint(-3.3835, 5.3535), 4326), 26, 190, 1280, 46),
  ('SENT-08-05', 'P08', 'Sentinelle 08-05', 'sain', NULL, ST_SetSRID(ST_MakePoint(-3.3845, 5.3525), 4326), 23, 165, 1150, 43);

-- ============================================
-- TABLE: parcelles (zones de palmeraie)
-- ============================================
CREATE TABLE IF NOT EXISTS parcelles (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  nom VARCHAR(100),
  type VARCHAR(50),
  status VARCHAR(20) CHECK (status IN ('critique', 'warning', 'normal')),
  geom GEOMETRY(POLYGON, 4326),
  superficie_ha DECIMAL(8,2),
  nb_palmiers INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_parcelles_geom ON parcelles USING GIST(geom);

-- Insertion des parcelles
INSERT INTO parcelles (code, nom, type, status, geom, superficie_ha, nb_palmiers) VALUES
  ('P01', 'Bordure Rivière', 'bordure_eau', 'normal', 
   ST_SetSRID(ST_MakePolygon(ST_MakeLine(ARRAY[
     ST_MakePoint(-3.389, 5.363),
     ST_MakePoint(-3.386, 5.363),
     ST_MakePoint(-3.386, 5.360),
     ST_MakePoint(-3.389, 5.360),
     ST_MakePoint(-3.389, 5.363)
   ])), 4326),
   45.5, 910),

  ('P02', 'Bas-Fond Humide', 'bas_fond', 'critique',
   ST_SetSRID(ST_MakePolygon(ST_MakeLine(ARRAY[
     ST_MakePoint(-3.386, 5.363),
     ST_MakePoint(-3.383, 5.363),
     ST_MakePoint(-3.383, 5.360),
     ST_MakePoint(-3.386, 5.360),
     ST_MakePoint(-3.386, 5.363)
   ])), 4326),
   38.2, 764),

  ('P05', 'Lisière Forêt', 'lisier_foret', 'warning',
   ST_SetSRID(ST_MakePolygon(ST_MakeLine(ARRAY[
     ST_MakePoint(-3.389, 5.357),
     ST_MakePoint(-3.386, 5.357),
     ST_MakePoint(-3.386, 5.354),
     ST_MakePoint(-3.389, 5.354),
     ST_MakePoint(-3.389, 5.357)
   ])), 4326),
   52.8, 1056);

-- ============================================
-- VUES pour faciliter les requêtes
-- ============================================

-- Vue: résumé des alertes par parcelle
CREATE OR REPLACE VIEW vue_alertes_parcelle AS
SELECT 
  p.code AS parcelle_code,
  p.nom AS parcelle_nom,
  p.status AS parcelle_status,
  COUNT(s.id) FILTER (WHERE s.status = 'critique') AS alertes_critiques,
  COUNT(s.id) FILTER (WHERE s.status = 'orange') AS alertes_orange,
  COUNT(s.id) FILTER (WHERE s.status = 'sain') AS sentinelles_saines,
  COUNT(s.id) AS total_sentinelles,
  AVG(s.risk_index)::INTEGER AS risk_index_moyen
FROM parcelles p
LEFT JOIN sentinelles s ON s.parcelle = p.code
GROUP BY p.code, p.nom, p.status;

-- Vue: sentinelles avec coordonnées GeoJSON-ready
CREATE OR REPLACE VIEW vue_sentinelles_geo AS
SELECT 
  s.*,
  ST_X(s.geom) AS longitude,
  ST_Y(s.geom) AS latitude,
  json_build_object(
    'type', 'Feature',
    'geometry', ST_AsGeoJSON(s.geom)::json,
    'properties', json_build_object(
      'id', s.id,
      'code', s.code,
      'status', s.status,
      'maladie', s.maladie_suspectee,
      'risk_index', s.risk_index
    )
  ) AS geojson
FROM sentinelles s;

-- ============================================
-- REQUÊTES EXEMPLES
-- ============================================

-- Liste toutes les alertes critiques
-- SELECT * FROM sentinelles WHERE status = 'critique' ORDER BY risk_index DESC;

-- Centres des parcelles pour la carte
-- SELECT code, nom, ST_X(ST_Centroid(geom)) AS lng, ST_Y(ST_Centroid(geom)) AS lat FROM parcelles;

-- Export GeoJSON des sentinelles
-- SELECT jsonb_build_object(
--   'type', 'FeatureCollection',
--   'features', jsonb_agg(ST_AsGeoJSON(s.*)::jsonb)
-- ) FROM sentinelles s;

-- ============================================
-- PROCÉDURE: Mise à jour automatique du statut parcelle
-- ============================================
CREATE OR REPLACE FUNCTION update_parcelle_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Met à jour le statut de la parcelle en fonction des sentinelles
  UPDATE parcelles p
  SET status = CASE
    WHEN (SELECT COUNT(*) FROM sentinelles WHERE parcelle = p.code AND status = 'critique') > 0 THEN 'critique'
    WHEN (SELECT COUNT(*) FROM sentinelles WHERE parcelle = p.code AND status = 'orange') > 0 THEN 'warning'
    ELSE 'normal'
  END
  WHERE code = NEW.parcelle;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger automatique (optionnel)
-- CREATE TRIGGER trg_update_parcelle_status
-- AFTER INSERT OR UPDATE ON sentinelles
-- FOR EACH ROW EXECUTE FUNCTION update_parcelle_status();

-- Commentaire sur les tables
COMMENT ON TABLE sentinelles IS 'Positions des boîtiers PhytoBox (1 boîtier / 50 palmiers)';
COMMENT ON TABLE parcelles IS 'Zones de palmeraie surveillées';
