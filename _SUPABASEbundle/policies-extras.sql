
-- Optional: role-aware policies (example for inspections)
-- Only supervisor/admin can update inspections after closed = true
create or replace function has_role(target_org uuid, role_name text)
returns boolean language sql stable as $$
  select exists(
    select 1 from memberships m
    where m.organization_id = target_org and m.user_id = auth.uid() and m.role = role_name
  );
$$;

create policy if not exists inspections_no_edit_after_close
on inspections for update
using ( is_member_of(organization_id) and (not closed or has_role(organization_id,'supervisor') or has_role(organization_id,'admin')) )
with check ( is_member_of(organization_id) and (not closed or has_role(organization_id,'supervisor') or has_role(organization_id,'admin')) );
