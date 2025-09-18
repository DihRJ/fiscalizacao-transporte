-- migration_invites.sql
-- Adds invitations table and optional expiry to memberships

alter table if exists memberships
  add column if not exists expires_at timestamptz;

create table if not exists invitations (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid not null references organizations(id) on delete cascade,
  email text not null,
  role text not null check (role in ('admin','supervisor','fiscal','auditor','controle')),
  token text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_by uuid,
  created_at timestamptz not null default now()
);

-- Optional: index for queries
create index if not exists invitations_org_idx on invitations(organization_id);
create index if not exists memberships_exp_idx on memberships(organization_id, user_id, expires_at);
