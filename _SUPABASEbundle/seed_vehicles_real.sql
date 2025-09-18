-- seed_vehicles_real.sql
-- Substitua 'org' pelo UUID da sua organização:
DO $$ DECLARE org uuid := '00000000-0000-0000-0000-000000000000'; BEGIN
  INSERT INTO vehicles (organization_id, prefix, plate, qrcode) VALUES (org, 'V001', 'RST1A23', 'VEH-V001')
  ON CONFLICT (organization_id, prefix) DO UPDATE SET plate = EXCLUDED.plate, qrcode = EXCLUDED.qrcode;
  INSERT INTO vehicles (organization_id, prefix, plate, qrcode) VALUES (org, 'V002', 'QWE2B34', 'VEH-V002')
  ON CONFLICT (organization_id, prefix) DO UPDATE SET plate = EXCLUDED.plate, qrcode = EXCLUDED.qrcode;
  INSERT INTO vehicles (organization_id, prefix, plate, qrcode) VALUES (org, 'V003', 'TYU3C45', 'VEH-V003')
  ON CONFLICT (organization_id, prefix) DO UPDATE SET plate = EXCLUDED.plate, qrcode = EXCLUDED.qrcode;
  INSERT INTO vehicles (organization_id, prefix, plate, qrcode) VALUES (org, 'V004', 'IOP4D56', 'VEH-V004')
  ON CONFLICT (organization_id, prefix) DO UPDATE SET plate = EXCLUDED.plate, qrcode = EXCLUDED.qrcode;
  INSERT INTO vehicles (organization_id, prefix, plate, qrcode) VALUES (org, 'V005', 'ASD5E67', 'VEH-V005')
  ON CONFLICT (organization_id, prefix) DO UPDATE SET plate = EXCLUDED.plate, qrcode = EXCLUDED.qrcode;
  INSERT INTO vehicles (organization_id, prefix, plate, qrcode) VALUES (org, 'V006', 'FGH6F78', 'VEH-V006')
  ON CONFLICT (organization_id, prefix) DO UPDATE SET plate = EXCLUDED.plate, qrcode = EXCLUDED.qrcode;
  INSERT INTO vehicles (organization_id, prefix, plate, qrcode) VALUES (org, 'V007', 'JKL7G89', 'VEH-V007')
  ON CONFLICT (organization_id, prefix) DO UPDATE SET plate = EXCLUDED.plate, qrcode = EXCLUDED.qrcode;
  INSERT INTO vehicles (organization_id, prefix, plate, qrcode) VALUES (org, 'V008', 'ZXC8H90', 'VEH-V008')
  ON CONFLICT (organization_id, prefix) DO UPDATE SET plate = EXCLUDED.plate, qrcode = EXCLUDED.qrcode;
  INSERT INTO vehicles (organization_id, prefix, plate, qrcode) VALUES (org, 'V009', 'VBN9J12', 'VEH-V009')
  ON CONFLICT (organization_id, prefix) DO UPDATE SET plate = EXCLUDED.plate, qrcode = EXCLUDED.qrcode;
  INSERT INTO vehicles (organization_id, prefix, plate, qrcode) VALUES (org, 'V010', 'MNB0K34', 'VEH-V010')
  ON CONFLICT (organization_id, prefix) DO UPDATE SET plate = EXCLUDED.plate, qrcode = EXCLUDED.qrcode;
END $$;
