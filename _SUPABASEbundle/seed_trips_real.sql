-- seed_trips_real.sql
-- Substitua 'org' pelo UUID da sua organização:
DO $$ DECLARE org uuid := '00000000-0000-0000-0000-000000000000'; BEGIN

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '501A' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V001' LIMIT 1),
  '2025-09-19T06:00:00-03:00'::timestamptz,
  '2025-09-19T06:45:00-03:00'::timestamptz,
  'B1',
  'manha'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '501A' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V002' LIMIT 1),
  '2025-09-19T17:00:00-03:00'::timestamptz,
  '2025-09-19T17:45:00-03:00'::timestamptz,
  'B2',
  'tarde'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '501B' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V003' LIMIT 1),
  '2025-09-19T06:00:00-03:00'::timestamptz,
  '2025-09-19T06:45:00-03:00'::timestamptz,
  'B1',
  'manha'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '501B' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V004' LIMIT 1),
  '2025-09-19T17:00:00-03:00'::timestamptz,
  '2025-09-19T17:45:00-03:00'::timestamptz,
  'B2',
  'tarde'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '501C' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V005' LIMIT 1),
  '2025-09-19T06:00:00-03:00'::timestamptz,
  '2025-09-19T06:45:00-03:00'::timestamptz,
  'B1',
  'manha'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '501C' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V006' LIMIT 1),
  '2025-09-19T17:00:00-03:00'::timestamptz,
  '2025-09-19T17:45:00-03:00'::timestamptz,
  'B2',
  'tarde'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '502' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V007' LIMIT 1),
  '2025-09-19T06:00:00-03:00'::timestamptz,
  '2025-09-19T06:45:00-03:00'::timestamptz,
  'B1',
  'manha'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '502' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V008' LIMIT 1),
  '2025-09-19T17:00:00-03:00'::timestamptz,
  '2025-09-19T17:45:00-03:00'::timestamptz,
  'B2',
  'tarde'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '504A' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V009' LIMIT 1),
  '2025-09-19T06:00:00-03:00'::timestamptz,
  '2025-09-19T06:45:00-03:00'::timestamptz,
  'B1',
  'manha'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '504A' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V010' LIMIT 1),
  '2025-09-19T17:00:00-03:00'::timestamptz,
  '2025-09-19T17:45:00-03:00'::timestamptz,
  'B2',
  'tarde'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '505' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V001' LIMIT 1),
  '2025-09-19T06:00:00-03:00'::timestamptz,
  '2025-09-19T06:45:00-03:00'::timestamptz,
  'B1',
  'manha'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '505' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V002' LIMIT 1),
  '2025-09-19T17:00:00-03:00'::timestamptz,
  '2025-09-19T17:45:00-03:00'::timestamptz,
  'B2',
  'tarde'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '508' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V003' LIMIT 1),
  '2025-09-19T06:00:00-03:00'::timestamptz,
  '2025-09-19T06:45:00-03:00'::timestamptz,
  'B1',
  'manha'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '508' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V004' LIMIT 1),
  '2025-09-19T17:00:00-03:00'::timestamptz,
  '2025-09-19T17:45:00-03:00'::timestamptz,
  'B2',
  'tarde'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '510A' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V005' LIMIT 1),
  '2025-09-19T06:00:00-03:00'::timestamptz,
  '2025-09-19T06:45:00-03:00'::timestamptz,
  'B1',
  'manha'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '510A' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V006' LIMIT 1),
  '2025-09-19T17:00:00-03:00'::timestamptz,
  '2025-09-19T17:45:00-03:00'::timestamptz,
  'B2',
  'tarde'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '510B' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V007' LIMIT 1),
  '2025-09-19T06:00:00-03:00'::timestamptz,
  '2025-09-19T06:45:00-03:00'::timestamptz,
  'B1',
  'manha'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '510B' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V008' LIMIT 1),
  '2025-09-19T17:00:00-03:00'::timestamptz,
  '2025-09-19T17:45:00-03:00'::timestamptz,
  'B2',
  'tarde'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '510C' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V009' LIMIT 1),
  '2025-09-19T06:00:00-03:00'::timestamptz,
  '2025-09-19T06:45:00-03:00'::timestamptz,
  'B1',
  'manha'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '510C' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V010' LIMIT 1),
  '2025-09-19T17:00:00-03:00'::timestamptz,
  '2025-09-19T17:45:00-03:00'::timestamptz,
  'B2',
  'tarde'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '514' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V001' LIMIT 1),
  '2025-09-19T06:00:00-03:00'::timestamptz,
  '2025-09-19T06:45:00-03:00'::timestamptz,
  'B1',
  'manha'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '514' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V002' LIMIT 1),
  '2025-09-19T17:00:00-03:00'::timestamptz,
  '2025-09-19T17:45:00-03:00'::timestamptz,
  'B2',
  'tarde'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '516' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V003' LIMIT 1),
  '2025-09-19T06:00:00-03:00'::timestamptz,
  '2025-09-19T06:45:00-03:00'::timestamptz,
  'B1',
  'manha'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '516' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V004' LIMIT 1),
  '2025-09-19T17:00:00-03:00'::timestamptz,
  '2025-09-19T17:45:00-03:00'::timestamptz,
  'B2',
  'tarde'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '518' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V005' LIMIT 1),
  '2025-09-19T06:00:00-03:00'::timestamptz,
  '2025-09-19T06:45:00-03:00'::timestamptz,
  'B1',
  'manha'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '518' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V006' LIMIT 1),
  '2025-09-19T17:00:00-03:00'::timestamptz,
  '2025-09-19T17:45:00-03:00'::timestamptz,
  'B2',
  'tarde'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '519' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V007' LIMIT 1),
  '2025-09-19T06:00:00-03:00'::timestamptz,
  '2025-09-19T06:45:00-03:00'::timestamptz,
  'B1',
  'manha'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '519' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V008' LIMIT 1),
  '2025-09-19T17:00:00-03:00'::timestamptz,
  '2025-09-19T17:45:00-03:00'::timestamptz,
  'B2',
  'tarde'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '519B' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V009' LIMIT 1),
  '2025-09-19T06:00:00-03:00'::timestamptz,
  '2025-09-19T06:45:00-03:00'::timestamptz,
  'B1',
  'manha'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '519B' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V010' LIMIT 1),
  '2025-09-19T17:00:00-03:00'::timestamptz,
  '2025-09-19T17:45:00-03:00'::timestamptz,
  'B2',
  'tarde'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '520' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V001' LIMIT 1),
  '2025-09-19T06:00:00-03:00'::timestamptz,
  '2025-09-19T06:45:00-03:00'::timestamptz,
  'B1',
  'manha'
ON CONFLICT DO NOTHING;

INSERT INTO trips (organization_id, line_id, planned_vehicle_id, planned_departure, planned_arrival, block_code, shift)
SELECT
  org,
  (SELECT id FROM lines WHERE organization_id = org AND code = '520' LIMIT 1),
  (SELECT id FROM vehicles WHERE organization_id = org AND prefix = 'V002' LIMIT 1),
  '2025-09-19T17:00:00-03:00'::timestamptz,
  '2025-09-19T17:45:00-03:00'::timestamptz,
  'B2',
  'tarde'
ON CONFLICT DO NOTHING;
END $$;
