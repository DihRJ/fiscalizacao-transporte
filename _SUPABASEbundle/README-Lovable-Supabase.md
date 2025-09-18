
# Fiscalização de Ônibus — Lovable + Supabase

## Passo a passo (setup rápido)
1. **Supabase →** novo projeto → copiar `Project URL` e `anon/service keys`.
2. **SQL Editor →** cole e execute `schema.sql`, depois `seed.sql`.
3. **Storage →** crie bucket `attachments` (privado) e aplique as **políticas** (ver `schema.sql`).
4. **Auth →** crie usuário Admin (signup). Copie o `auth.users.id` e insira no `seed.sql` (membros).
5. (Opcional) **Policies adicionais** para limitar ações por `role` (ex.: `fiscal` sem update após `closed = true`).

## Variáveis (.env) no Lovable/Next
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE=
OTP_THRESHOLD_MIN=5
```

## Rotas/Telas (sugestão)
- `/app` (Dashboard): KPIs (OTP, atrasos, incidentes, vistorias).
- `/app/trips` (Programação): import/export, calendário, lista.
- `/app/trips/:id` (Execução): partida/chegada real, atraso, motivo.
- `/app/inspections/new` (PWA offline): QR do veículo → checklist → fotos/assinatura → finalizar.
- `/app/incidents/new` (Rápido): tipo, gravidade, geo, anexos.
- `/app/reports` (Relatórios): filtros → PDF/XLSX.
- `/admin` (Catálogos/Templates): motivos, tipos, templates versionados.
- `/admin/org` (Organização): dados, logo, retenção, membros.

## Tabelas chave e joins
- `trips` ↔ `trip_events` (1:N)
- `checklist_templates` ↔ `checklist_items` (1:N)
- `inspections` ↔ `inspection_answers` (1:N)
- `operators` ↔ `lines` ↔ `trips` ; `operators` ↔ `vehicles`
- `attachments` com owner_type + owner_id

## Cálculos (front/back)
- `delay_min` já gerado em `trip_events` quando partidas existem.
- `otp_flag(actual, planned, threshold)` -> usar na API/SQL.
- View `kpi_otp_by_line_day` para cards e gráficos.

## PWA Offline (resumo)
- IndexedDB para filas `inspections`, `incidents`, `attachments`.
- Estratégia: Background Sync quando online, resolução por timestamp.
- Armazenar anexos em `File`/`Blob` até upload para Storage (path por organização).

## Auditoria
- Persistir ações relevantes em `audit_logs`.
- No front, sempre incluir `organization_id` no payload.
