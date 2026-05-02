-- ============================================================
-- DONNEES DE TEST - PHYTOBOX PALMCI - ZONE TOUMANGUIE (100 ha)
-- Coordonnées centre : 5.361492, -3.387336
-- ============================================================

-- --------------------------------------------------------
-- PLANTATION
-- --------------------------------------------------------
INSERT INTO plantations (id, nom, localisation, superficie_totale, created_at) VALUES
(1, 'Toumanguié', ST_GeogFromText('POINT(-3.387336 5.361492)'), 6000.00, NOW());

-- --------------------------------------------------------
-- BLOCS
-- --------------------------------------------------------
INSERT INTO blocs (id, nom, plantation_id, created_at) VALUES
(1, 'Bloc A1 – Secteur Nord', 1, NOW()),
(2, 'Bloc A2 – Secteur Sud', 1, NOW());

-- --------------------------------------------------------
-- PARCELLES (8 parcelles couvrant ~100 ha)
-- --------------------------------------------------------
INSERT INTO parcelles (id, nom, surface, localisation, bloc_id, created_at) VALUES
(1, 'P01 – Bordure Rivière', 12.5, ST_GeogFromText('POLYGON((-3.389 5.363, -3.386 5.363, -3.386 5.360, -3.389 5.360, -3.389 5.363))'), 1, NOW()),
(2, 'P02 – Bas-Fond Humide', 14.0, ST_GeogFromText('POLYGON((-3.386 5.363, -3.383 5.363, -3.383 5.360, -3.386 5.360, -3.386 5.363))'), 1, NOW()),
(3, 'P03 – Plateau Centre', 13.0, ST_GeogFromText('POLYGON((-3.389 5.360, -3.386 5.360, -3.386 5.357, -3.389 5.357, -3.389 5.360))'), 1, NOW()),
(4, 'P04 – Zone Haute', 11.5, ST_GeogFromText('POLYGON((-3.386 5.360, -3.383 5.360, -3.383 5.357, -3.386 5.357, -3.386 5.360))'), 1, NOW()),
(5, 'P05 – Lisière Forêt', 13.5, ST_GeogFromText('POLYGON((-3.389 5.357, -3.386 5.357, -3.386 5.354, -3.389 5.354, -3.389 5.357))'), 2, NOW()),
(6, 'P06 – Zone Drainée', 12.0, ST_GeogFromText('POLYGON((-3.386 5.357, -3.383 5.357, -3.383 5.354, -3.386 5.354, -3.386 5.357))'), 2, NOW()),
(7, 'P07 – Pente Douce', 11.0, ST_GeogFromText('POLYGON((-3.389 5.354, -3.386 5.354, -3.386 5.351, -3.389 5.351, -3.389 5.354))'), 2, NOW()),
(8, 'P08 – Sommet', 12.5, ST_GeogFromText('POLYGON((-3.386 5.354, -3.383 5.354, -3.383 5.351, -3.386 5.351, -3.386 5.354))'), 2, NOW());

-- --------------------------------------------------------
-- PALMIERS SENTINELLES (1 tous les 50 arbres → ~1/ha)
-- Chaque sentinelle a un état adapté à sa parcelle
-- --------------------------------------------------------
DO $$
DECLARE
    parcelle_id INT;
    i INT;
    base_lat NUMERIC(12,9);
    base_lon NUMERIC(12,9);
    delta_lat NUMERIC := 0.0003;
    delta_lon NUMERIC := 0.0004;
BEGIN
    FOR parcelle_id IN 1..8 LOOP
        SELECT ST_Y(ST_Centroid(localisation::geometry)), ST_X(ST_Centroid(localisation::geometry))
        INTO base_lat, base_lon FROM parcelles WHERE id = parcelle_id;

        FOR i IN 0..18 LOOP
            INSERT INTO palmiers (nom, parcelle_id, localisation, health_status, risk_level, derniere_inspection, photo_url, created_at)
            VALUES (
                'SENT-' || LPAD(parcelle_id::text, 2, '0') || '-' || LPAD(i::text, 2, '0'),
                parcelle_id,
                ST_GeogFromText('POINT(' || (base_lon + (i % 5) * delta_lon) || ' ' || (base_lat + (i / 5)::int * delta_lat) || ')'),
                CASE
                    WHEN parcelle_id = 2 AND i IN (3,7,12) THEN 'critical'
                    WHEN parcelle_id = 2 AND i IN (1,5,9,15) THEN 'warning'
                    WHEN parcelle_id = 5 AND i IN (4,8,14) THEN 'warning'
                    WHEN parcelle_id = 1 AND i IN (6,11) THEN 'critical'
                    WHEN parcelle_id = 4 AND i IN (10) THEN 'warning'
                    ELSE 'healthy'
                END,
                CASE
                    WHEN parcelle_id = 2 AND i IN (3,7,12) THEN FLOOR(65 + RANDOM() * 30)
                    WHEN parcelle_id = 2 AND i IN (1,5,9,15) THEN FLOOR(35 + RANDOM() * 25)
                    WHEN parcelle_id = 5 AND i IN (4,8,14) THEN FLOOR(35 + RANDOM() * 25)
                    WHEN parcelle_id = 1 AND i IN (6,11) THEN FLOOR(60 + RANDOM() * 35)
                    WHEN parcelle_id = 4 AND i IN (10) THEN FLOOR(30 + RANDOM() * 30)
                    ELSE FLOOR(5 + RANDOM() * 20)
                END,
                CURRENT_DATE - (RANDOM() * 30)::int,
                NULL,
                NOW()
            );
        END LOOP;
    END LOOP;
END;
$$;

-- --------------------------------------------------------
-- EQUIPEMENTS (PhytoBox)
-- --------------------------------------------------------
DO $$
DECLARE
    palmier_record RECORD;
    dev_counter INT := 1;
BEGIN
    FOR palmier_record IN SELECT id, health_status FROM palmiers LOOP
        INSERT INTO equipements (dev_eui, palmier_id, date_installation, niveau_batterie, capteur_status, derniere_maintenance, created_at)
        VALUES (
            LPAD(TO_HEX(700000 + dev_counter), 16, '0'),
            palmier_record.id,
            CURRENT_DATE - (RANDOM() * 90)::int,
            FLOOR(60 + RANDOM() * 40),
            CASE WHEN palmier_record.health_status = 'critical' AND RANDOM() > 0.8 THEN 'error_sonde' ELSE 'ok' END,
            CURRENT_DATE - (RANDOM() * 60)::int,
            NOW()
        );
        dev_counter := dev_counter + 1;
    END LOOP;
END;
$$;

-- --------------------------------------------------------
-- UTILISATEURS & EQUIPES
-- --------------------------------------------------------
INSERT INTO equipes (id, nom, chef_id, created_at) VALUES
(1, 'Équipe Nord', NULL, NOW()),
(2, 'Équipe Sud', NULL, NOW());

INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe_hash, role, telephone, equipe_id, created_at) VALUES
('Koné', 'Mamadou', 'ouvrier1@phyto.ci', '$2b$12$test', 'ouvrier', '+2250102030405', 1, NOW()),
('Traoré', 'Aminata', 'ouvrier2@phyto.ci', '$2b$12$test', 'ouvrier', '+2250102030406', 2, NOW()),
('Kouassi', 'Jean', 'chef.bloc1@phyto.ci', '$2b$12$test', 'chef_bloc', '+2250708091011', 1, NOW()),
('Konaté', 'Fatou', 'chef.bloc2@phyto.ci', '$2b$12$test', 'chef_bloc', '+2250708091012', 2, NOW()),
('Bamba', 'Ibrahim', 'admin@phyto.ci', '$2b$12$test', 'admin', '+2250506070809', NULL, NOW());

UPDATE equipes SET chef_id = 3 WHERE id = 1;
UPDATE equipes SET chef_id = 4 WHERE id = 2;

-- --------------------------------------------------------
-- PRODUITS
-- --------------------------------------------------------
INSERT INTO produits (nom, type, dose_ha, unite, stock, created_at) VALUES
('Trichoderma asperellum', 'fongicide_biologique', 2.0, 'kg/ha', 500, NOW()),
('Beauveria bassiana', 'insecticide_biologique', 1.0, 'kg/ha', 300, NOW()),
('Metarhizium anisopliae', 'insecticide_biologique', 1.5, 'kg/ha', 200, NOW()),
('Bacillus thuringiensis', 'insecticide_biologique', 1.0, 'L/ha', 400, NOW()),
('Fongicide Chimique SX-3000', 'fongicide_chimique', 3.0, 'L/ha', 1000, NOW());

-- --------------------------------------------------------
-- RELEVES CAPTEURS (scénarios variés)
-- --------------------------------------------------------
DO $$
DECLARE
    equip_rec RECORD;
    palm_rec RECORD;
    ts TIMESTAMPTZ;
    j INT;
    base_risk INT;
    base_cov INT;
    base_ac INT;
    base_soil INT;
    hr_level INT;
BEGIN
    FOR equip_rec IN SELECT id, palmier_id FROM equipements LOOP
        SELECT health_status, parcelle_id INTO palm_rec FROM palmiers WHERE id = equip_rec.palmier_id;

        ts := NOW() - INTERVAL '6 hours';

        CASE
            WHEN palm_rec.health_status = 'critical' THEN
                base_risk := 72; base_cov := 780; base_ac := 4800; base_soil := 88; hr_level := 92;
            WHEN palm_rec.health_status = 'warning' THEN
                base_risk := 42; base_cov := 420; base_ac := 2200; base_soil := 78; hr_level := 85;
            WHEN palm_rec.parcelle_id = 2 THEN
                base_risk := 28; base_cov := 280; base_ac := 1200; base_soil := 85; hr_level := 82;
            ELSE
                base_risk := 12; base_cov := 120; base_ac := 600; base_soil := 62; hr_level := 68;
        END CASE;

        FOR j IN 0..5 LOOP
            INSERT INTO releves_capteurs (equipement_id, timestamp, risk_index, cov1, cov2, cov3, ac_energy, trap_count, soil_moisture, air_temp, air_hum, flags)
            VALUES (
                equip_rec.id,
                ts + (j * INTERVAL '1 hour'),
                base_risk + FLOOR(RANDOM() * 10) - 5,
                base_cov + FLOOR(RANDOM() * 60) - 30,
                base_cov + FLOOR(RANDOM() * 50) - 25,
                base_cov + FLOOR(RANDOM() * 40) - 20,
                base_ac + FLOOR(RANDOM() * 800) - 400,
                CASE WHEN palm_rec.health_status = 'critical' THEN FLOOR(3 + RANDOM() * 3) ELSE FLOOR(0 + RANDOM() * 2) END,
                base_soil + FLOOR(RANDOM() * 6) - 3,
                FLOOR(24 + RANDOM() * 6),
                hr_level + FLOOR(RANDOM() * 10) - 5,
                0
            );
        END LOOP;
    END LOOP;
END;
$$;

-- --------------------------------------------------------
-- ALERTES (déclenchées par les seuils)
-- --------------------------------------------------------
INSERT INTO alertes (type, severity, message, palmier_id, equipement_id, utilisateur_id, is_read, created_at) 
SELECT
    'capteur',
    CASE WHEN risk_index > 60 THEN 2 ELSE 1 END,
    CASE
        WHEN risk_index > 60 THEN 'Alerte critique : COV élevés, suspicion pourriture du coeur ou Ganoderma. Inspection urgente requise.'
        ELSE 'Alerte vigilance : conditions favorables au développement fongique détectées.'
    END,
    p.id,
    e.id,
    NULL,
    FALSE,
    NOW() - (RANDOM() * INTERVAL '4 hours')
FROM releves_capteurs r
JOIN equipements e ON r.equipement_id = e.id
JOIN palmiers p ON e.palmier_id = p.id
WHERE r.risk_index > 30
AND r.timestamp = (SELECT MAX(timestamp) FROM releves_capteurs WHERE equipement_id = r.equipement_id);

-- Quelques alertes manuelles (signalement ouvrier)
INSERT INTO alertes (type, severity, message, palmier_id, equipement_id, utilisateur_id, is_read, created_at)
SELECT
    'manuel',
    1,
    'Jaunissement suspect des feuilles basses observé lors de la tournée.',
    p.id,
    NULL,
    1,
    TRUE,
    NOW() - INTERVAL '3 hours'
FROM palmiers p
WHERE p.health_status = 'warning'
LIMIT 3;

-- Alerte météo (conditions favorables)
INSERT INTO alertes (type, severity, message, palmier_id, equipement_id, utilisateur_id, is_read, created_at) VALUES
('meteo', 1, 'Prévisions de fortes pluies et humidité > 90% pour les 48 prochaines heures. Risque fongique accru sur zones sensibles.', NULL, NULL, NULL, FALSE, NOW());

-- --------------------------------------------------------
-- INTERVENTIONS
-- --------------------------------------------------------
INSERT INTO interventions (type, date_prevue, date_realisation, statut, palmier_id, equipe_id, produit_id, quantite, note, created_at)
SELECT
    'traitement',
    NOW() + INTERVAL '1 day',
    NULL,
    'planifiee',
    p.id,
    1,
    1,
    ROUND(2.0 * 0.5, 2),
    'Application de Trichoderma asperellum sur périmètre de 20 m autour du sentinelle.',
    NOW()
FROM palmiers p
JOIN equipements e ON e.palmier_id = p.id
JOIN releves_capteurs r ON r.equipement_id = e.id
WHERE r.risk_index > 60
AND r.timestamp = (SELECT MAX(timestamp) FROM releves_capteurs WHERE equipement_id = e.id);

INSERT INTO interventions (type, date_prevue, date_realisation, statut, palmier_id, equipe_id, produit_id, quantite, note, created_at)
SELECT
    'inspection',
    NOW() + INTERVAL '1 day',
    NULL,
    'planifiee',
    p.id,
    2,
    NULL,
    NULL,
    'Inspection visuelle de contrôle après alerte vigilance.',
    NOW()
FROM palmiers p
JOIN equipements e ON e.palmier_id = p.id
JOIN releves_capteurs r ON r.equipement_id = e.id
WHERE r.risk_index BETWEEN 30 AND 60
AND r.timestamp = (SELECT MAX(timestamp) FROM releves_capteurs WHERE equipement_id = e.id);
