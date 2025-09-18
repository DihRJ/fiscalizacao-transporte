
-- Demo data for two organizations
insert into organizations (id, name, legal_id) values
  ('00000000-0000-0000-0000-000000000001', 'Prefeitura A', '00.000.000/0001-00'),
  ('00000000-0000-0000-0000-000000000002', 'Prefeitura B', '11.111.111/0001-11')
on conflict do nothing;

-- NOTE: Add your user_id below after running auth signup; replace placeholders.
-- Example:
-- insert into memberships (user_id, organization_id, role) values
--   ('<YOUR_AUTH_USER_ID>', '00000000-0000-0000-0000-000000000001','admin'),
--   ('<YOUR_AUTH_USER_ID>', '00000000-0000-0000-0000-000000000002','admin');

insert into operators (organization_id, name, legal_id) values
  ('00000000-0000-0000-0000-000000000001','Operadora Norte','12.345.678/0001-90'),
  ('00000000-0000-0000-0000-000000000001','Operadora Sul','98.765.432/0001-09');

insert into lines (organization_id, operator_id, code, name, planned_km) 
select o.organization_id, o.id, v.code, v.name, v.km
from (
  values
  ('00000000-0000-0000-0000-000000000001','501C','Centro x Balneário',18.5),
  ('00000000-0000-0000-0000-000000000001','510C','São Pedro x Balneário',22.3),
  ('00000000-0000-0000-0000-000000000001','519B','Praia x Estação',12.8)
) v(org_id, code, name, km)
join operators o on o.organization_id = v.org_id
limit 3;

insert into vehicles (organization_id, operator_id, prefix, plate, year, accessibility, air_conditioning, active)
select o.organization_id, o.id,
       'BUS-'||lpad((row_number() over (order by o.id))::text,3,'0'),
       'ABC'||lpad((row_number() over (order by o.id))::text,4,'0'),
       2019 + (random()*5)::int, (random()>0.5), (random()>0.5), true
from operators o
limit 10;

-- Simple checklist template
insert into checklist_templates (organization_id, name, kind, version)
values ('00000000-0000-0000-0000-000000000001','Vistoria Operacional Diária','veiculo',1);

insert into checklist_items (template_id, title, input_type, weight, critical, order_index)
select ct.id, i.title, i.type, i.weight, i.critical, i.ord
from checklist_templates ct
cross join (
  values
  ('Pneus em bom estado','oknok',1.0,true,1),
  ('Elevador de acessibilidade funcionando','oknok',2.0,true,2),
  ('Luzes internas e externas','oknok',1.0,false,3),
  ('Limpeza interna','oknok',1.0,false,4),
  ('Extintor e itens de segurança','oknok',1.5,true,5),
  ('Assinatura do motorista','assinatura',1.0,false,6)
) i(title, type, weight, critical, ord)
where ct.name='Vistoria Operacional Diária' and ct.organization_id='00000000-0000-0000-0000-000000000001';

