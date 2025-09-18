# Fiscalização de Ônibus — App Web (Next.js + Supabase)

Este repositório contém um **MVP funcional** do aplicativo de fiscalização.
- Frontend: Next.js 14 (App Router), React 18
- Backend: Rotas /api com Supabase **Service Role**
- Integração: Supabase (Auth, DB, Storage)
- PWA: manifest + service worker básico
- Offline: fila simples em IndexedDB (utils/indexeddb.ts)

## Pré-requisitos
- Node 18+
- Um projeto Supabase com o schema SQL configurado (use o `schema.sql` que te entreguei)

## Configuração
1. Copie `.env.example` para `.env.local` e preencha:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE=...
OTP_THRESHOLD_MIN=5
```
2. Instale dependências e rode:
```
npm install
npm run dev
```
3. Acesse:
- `/` (cards)
- `/dashboard`
- `/trips`
- `/inspections/new`
- `/incidents/new`
- `/reports`
- `/admin`

## Observações importantes
- As rotas **/api** usam `SUPABASE_SERVICE_ROLE`. Proteja sua implantação (route handlers só no **server**).
- Ajuste políticas RLS para seu fluxo real.
- O formulário de **Vistoria** e **Incidente** estão prontos para POST básico; expanda para anexos no Storage conforme necessário.

## Importar Viagens
Envie CSV (headers do arquivo `template_trips.csv`) para `POST /api/trips/import`.

## Convites por e-mail (com expiração)
- Execute `migration_invites.sql` (na pasta `_SUPABASEbundle`).
- **Criar convite**: `POST /api/admin/invitations` (admin) com `{ organization_id, email, role, expires_at? }` → retorna `url` de convite.
- **Aceitar**: usuário logado acessa `/invite/:token` → cria `membership` se o e-mail do token coincidir com o do usuário.

## Expiração de papéis
- `memberships.expires_at` (opcional). A verificação de papel no servidor invalida papéis expirados.

## Auditoria
- API: `GET /api/admin/audit?organization_id=...&start=...&end=...`
- UI: `/admin/audit` com filtros de período.

## Gráficos no Dashboard
- Implementado com **Recharts**: série de OTP (últimos 21 dias) e barras de incidentes (30 dias).

## Convites por e-mail
- Configure SMTP no `.env.local` (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`).
- Ao criar convite (`POST /api/admin/invitations`), o sistema tenta enviar e-mail automaticamente com o link.

## Edge Functions (cron)
- Exemplos em `_SUPABASE/edge-functions/` (OTP < alvo, lembrete de convites).
- Deploy pelo CLI do Supabase e agendamento por Scheduled Triggers.

## Importar Linhas (CSV)
- Endpoint: `POST /api/lines/import` (papéis: **supervisor**, **admin**)
- Envie CSV no formato do `lines_real.csv` (colunas: `organization_id,code,name,active`).
- O endpoint faz **upsert** em `(organization_id, code)`.

## Gerador por Calendário
UI: `/tools/generate-trips` (RBAC: supervisor/admin via token no `authedFetch`).
API: `POST /api/tools/generate-trips?format=csv|sql`
Body:
```json
{
  "organization_id": "UUID",
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD",
  "line_codes": ["501A","510C"],
  "vehicle_prefixes": ["V001","V002","V003"],
  "service_config": {
    "defaults": { "peak_headway_min":15, "offpeak_headway_min":30, "evening_headway_min":30, "weekend_headway_min":30, "duration_min":45 },
    "per_line": { "510C": { "duration_min": 35, "circular": true } },
    "calendar": { "weekday": { "blocks": [["06:00","09:00","peak"],["09:00","16:00","offpeak"],["16:00","19:00","peak"],["19:00","22:00","evening"]] }, "saturday": { "blocks": [["07:00","22:00","weekend"]] }, "sunday": { "blocks": [["07:00","22:00","weekend"]] }, "holiday": { "blocks": [["07:00","21:00","weekend"]] } },
    "special_days": { "2025-09-24": "holiday" }
  }
}
```
Retorna um **CSV** ou **SQL** para importação (conforme `format`). O gerador **não lê do banco**: informe explicitamente as **linhas** e **veículos**.
