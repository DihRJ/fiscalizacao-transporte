
# Endpoints sugeridos (Next.js Route Handlers)

## POST /api/trips/import
Body: CSV (lines with headers as in template_trips.csv)
- Resolve `line_id` via `line_code` + `organization_id`
- Resolve `planned_vehicle_id` via `prefix`
- Inserts into `trips`

## POST /api/trip-events/:tripId/departure
Body: { vehicle_id?, actual_departure, reason_code?, note? }
- Inserts into `trip_events` (copy `planned_departure` from `trips`)

## POST /api/inspections
Body: { organization_id, template_id, vehicle_id?, line_id?, answers: [{item_id, value_json, required, attachments[]}] }
- Inserts `inspections`, then `inspection_answers`
- Upload attachments to Storage at `org/inspection/{inspection_id}/...`

## POST /api/incidents
Body: { organization_id, type, severity, occurred_at?, line_id?, vehicle_id?, trip_id?, description, geom?, attachments[] }
