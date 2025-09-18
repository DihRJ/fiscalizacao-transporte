
-- Supabase / Postgres schema for "Fiscalização de Ônibus"
-- Encoding: UTF-8

create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

-- ============== Core / Organizations & RBAC ==============
create table if not exists organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  legal_id text,        -- CNPJ/ID
  logo_url text,
  timezone text not null default 'America/Sao_Paulo',
  retention_months int not null default 24,
  created_at timestamptz not null default now()
);

create table if not exists memberships (
  user_id uuid not null,                     -- auth.users.id
  organization_id uuid not null references organizations(id) on delete cascade,
  role text not null check (role in ('admin','supervisor','fiscal','auditor','controle')),
  created_at timestamptz not null default now(),
  primary key (user_id, organization_id)
);

-- Helper table for operators / depots / catalogs
create table if not exists operators (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  legal_id text,
  contact jsonb default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists depots (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  operator_id uuid references operators(id) on delete set null,
  name text not null,
  address text,
  geo geometry(Point, 4326),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists lines (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  operator_id uuid references operators(id) on delete set null,
  code text not null,
  name text not null,
  planned_km numeric(10,2) default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (organization_id, code)
);

create table if not exists stops (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  code text,
  name text not null,
  geo geometry(Point, 4326),
  created_at timestamptz not null default now()
);

create table if not exists vehicles (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  operator_id uuid references operators(id) on delete set null,
  depot_id uuid references depots(id) on delete set null,
  prefix text not null,
  plate text,
  vin text,
  year int,
  accessibility boolean default false,
  air_conditioning boolean default false,
  odometer_km numeric(10,1) default 0,
  active boolean not null default true,
  qrcode text,
  created_at timestamptz not null default now(),
  unique (organization_id, prefix)
);

-- Programação e execução de viagens
create table if not exists trips (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  line_id uuid not null references lines(id) on delete cascade,
  planned_vehicle_id uuid references vehicles(id) on delete set null,
  planned_departure timestamptz not null,
  planned_arrival timestamptz,
  block_code text,       -- bloco/viagem
  shift text,            -- turno
  created_at timestamptz not null default now()
);

create table if not exists trip_events (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  trip_id uuid not null references trips(id) on delete cascade,
  vehicle_id uuid references vehicles(id) on delete set null,
  actual_departure timestamptz,
  actual_arrival timestamptz,
  delay_min int generated always as (
    case
      when actual_departure is not null and planned_departure is not null
      then greatest(0, extract(epoch from (actual_departure - planned_departure)) / 60)::int
      else null
    end
  ) stored,
  reason_code text,
  note text,
  source text default 'fiscal',  -- fiscal, controle, import
  planned_departure timestamptz, -- denormalization for fast calc
  created_by uuid,
  created_at timestamptz not null default now()
);

-- Templates de checklist (vistorias)
create table if not exists checklist_templates (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  kind text not null check (kind in ('veiculo','documental','parada')),
  version int not null default 1,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists checklist_items (
  id uuid primary key default uuid_generate_v4(),
  template_id uuid not null references checklist_templates(id) on delete cascade,
  title text not null,
  input_type text not null check (input_type in ('oknok','nota','texto','foto_obrigatoria','assinatura')),
  weight numeric(6,2) not null default 1.0,
  critical boolean not null default false,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

-- Vistorias
create table if not exists inspections (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  template_id uuid not null references checklist_templates(id) on delete restrict,
  vehicle_id uuid references vehicles(id) on delete set null,
  line_id uuid references lines(id) on delete set null,
  stop_id uuid references stops(id) on delete set null,
  inspector_id uuid not null,                      -- auth.users.id
  inspected_at timestamptz not null default now(),
  geom geometry(Point, 4326),
  result text not null check (result in ('aprovado','reprovado','pendente')),
  notes text,
  score numeric(6,2),
  closed boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists inspection_answers (
  id uuid primary key default uuid_generate_v4(),
  inspection_id uuid not null references inspections(id) on delete cascade,
  item_id uuid not null references checklist_items(id) on delete cascade,
  value_json jsonb,
  required boolean default false,
  created_at timestamptz not null default now(),
  unique (inspection_id, item_id)
);

-- Incidentes / Quebras
create table if not exists incidents (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  type text not null check (type in ('quebra','acidente','seguranca','conduta','lotacao','parada_irregular','desvio')),
  severity int not null check (severity between 1 and 5),
  occurred_at timestamptz not null default now(),
  geom geometry(Point, 4326),
  line_id uuid references lines(id) on delete set null,
  vehicle_id uuid references vehicles(id) on delete set null,
  trip_id uuid references trips(id) on delete set null,
  description text,
  status text not null default 'aberto' check (status in ('aberto','em_analise','fechado')),
  assigned_to uuid,
  created_by uuid,
  created_at timestamptz not null default now()
);

-- Penalidades
create table if not exists penalties (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  operator_id uuid references operators(id) on delete set null,
  type text not null,
  legal_basis text,
  amount numeric(12,2),
  origin text check (origin in ('inspecao','atraso','incidente')),
  links jsonb default '[]'::jsonb,
  status text not null default 'aberta' check (status in ('aberta','em_cobranca','quitada','cancelada')),
  created_at timestamptz not null default now()
);

-- Storage logical references (files live in Storage)
create table if not exists attachments (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  owner_type text not null check (owner_type in ('inspection','incident','trip_event','report')),
  owner_id uuid not null,
  bucket text not null default 'attachments',
  path text not null,         -- convention: {organization_id}/{owner_type}/{owner_id}/{filename}
  mime text,
  size_bytes bigint,
  sha256 text,
  created_by uuid,
  created_at timestamptz not null default now()
);

-- SLAs
create table if not exists slas (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name text not null,
  metric text not null,      -- otp, incident_rate, approval_rate, etc.
  target numeric(6,2) not null,
  window text not null default 'monthly', -- daily/weekly/monthly
  params jsonb default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Audit
create table if not exists audit_logs (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid,
  user_id uuid,
  action text,
  entity text,
  entity_id uuid,
  summary jsonb,
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);

-- ============== Utility Views & Functions ==============

-- Fast OTP calculation per trip_event: on-time if departure <= threshold minutes
create or replace function otp_flag(actual timestamptz, planned timestamptz, threshold_min int default 5)
returns boolean language sql immutable as $$
  select case
    when actual is null or planned is null then null
    else (extract(epoch from (actual - planned))/60.0) <= threshold_min
  end;
$$;

-- KPI view: OTP by line and day
create or replace view kpi_otp_by_line_day as
select
  t.organization_id,
  t.line_id,
  date_trunc('day', te.planned_departure) as day,
  count(*) filter (where te.actual_departure is not null) as trips_with_data,
  avg( (otp_flag(te.actual_departure, te.planned_departure, 5))::int ) * 100.0 as otp_percent
from trips t
join trip_events te on te.trip_id = t.id
group by 1,2,3;

-- ============== RLS ==============
alter table organizations enable row level security;
alter table memberships   enable row level security;
alter table operators     enable row level security;
alter table depots        enable row level security;
alter table lines         enable row level security;
alter table stops         enable row level security;
alter table vehicles      enable row level security;
alter table trips         enable row level security;
alter table trip_events   enable row level security;
alter table checklist_templates enable row level security;
alter table checklist_items     enable row level security;
alter table inspections         enable row level security;
alter table inspection_answers  enable row level security;
alter table incidents           enable row level security;
alter table penalties           enable row level security;
alter table attachments         enable row level security;
alter table slas                enable row level security;
alter table audit_logs          enable row level security;

-- Helper: check if auth user belongs to org
create or replace function is_member_of(org uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from memberships m where m.organization_id = org and m.user_id = auth.uid()
  );
$$;

-- Organization-scoped policy macro (applied repeatedly)
do $$
declare
  t record;
begin
  for t in
    select unnest(array[
      'operators','depots','lines','stops','vehicles','trips','trip_events',
      'checklist_templates','checklist_items','inspections','inspection_answers',
      'incidents','penalties','attachments','slas','audit_logs'
    ]) as tbl
  loop
    execute format('
      create policy if not exists %I_select on %I
      for select using ( is_member_of(organization_id) );
    ', t.tbl || '_select', t.tbl);

    execute format('
      create policy if not exists %I_insert on %I
      for insert with check ( is_member_of(organization_id) );
    ', t.tbl || '_insert', t.tbl);

    execute format('
      create policy if not exists %I_update on %I
      for update using ( is_member_of(organization_id) )
      with check ( is_member_of(organization_id) );
    ', t.tbl || '_update', t.tbl);

    execute format('
      create policy if not exists %I_delete on %I
      for delete using ( is_member_of(organization_id) );
    ', t.tbl || '_delete', t.tbl);
  end loop;

  -- organizations: admin-only within same org via membership role
  execute '
    create policy if not exists org_select on organizations
    for select using ( is_member_of(id) );
  ';

  execute '
    create policy if not exists org_update on organizations
    for update using ( is_member_of(id) );
  ';

  -- memberships: user can read their memberships, admins of org can manage
  execute '
    create policy if not exists mem_select on memberships
    for select using ( user_id = auth.uid() or exists (
      select 1 from memberships m2 where m2.organization_id = memberships.organization_id
      and m2.user_id = auth.uid() and m2.role = ''admin''))';
  execute '
    create policy if not exists mem_mutate on memberships
    for all using ( exists (
      select 1 from memberships m2 where m2.organization_id = memberships.organization_id
      and m2.user_id = auth.uid() and m2.role = ''admin'')) with check (exists (
      select 1 from memberships m2 where m2.organization_id = memberships.organization_id
      and m2.user_id = auth.uid() and m2.role = ''admin''))';
end $$;

-- ============== Storage (run in SQL editor; bucket via dashboard) ==============
-- Create a convention for file paths: {organization_id}/{owner_type}/{owner_id}/{filename}
-- In Supabase Storage, create bucket "attachments" (public = false) and apply RLS policies on storage.objects:
-- Example policies (paste in Storage policies GUI using SQL editor):
--
-- create policy "attachments_read" on storage.objects for select
--   using (
--     bucket_id = 'attachments'
--     and is_member_of( split_part(name, '/', 1)::uuid )
--   );
--
-- create policy "attachments_insert" on storage.objects for insert
--   with check (
--     bucket_id = 'attachments'
--     and is_member_of( split_part(name, '/', 1)::uuid )
--   );
--
-- create policy "attachments_update" on storage.objects for update using (
--     bucket_id = 'attachments'
--     and is_member_of( split_part(name, '/', 1)::uuid )
--   ) with check (
--     bucket_id = 'attachments'
--     and is_member_of( split_part(name, '/', 1)::uuid )
--   );
--
-- create policy "attachments_delete" on storage.objects for delete using (
--   bucket_id = 'attachments'
--   and is_member_of( split_part(name, '/', 1)::uuid )
-- );

