-- seed_lines_real.sql
-- Substitua pelo UUID da sua organização:
DO $$ DECLARE org uuid := '00000000-0000-0000-0000-000000000000'; BEGIN
  INSERT INTO lines (organization_id, code, name, active)
  VALUES (org, '501A', 'PRAIA DO SUDOESTE X BOA VISTA (VIA BASE)', true)
  ON CONFLICT (organization_id, code) DO UPDATE SET name = EXCLUDED.name, active = true;
  INSERT INTO lines (organization_id, code, name, active)
  VALUES (org, '501B', 'PRAIA DO SUDOESTE X BOA VISTA (VIA MORRO)', true)
  ON CONFLICT (organization_id, code) DO UPDATE SET name = EXCLUDED.name, active = true;
  INSERT INTO lines (organization_id, code, name, active)
  VALUES (org, '501C', 'PRAIA DO SUDOESTE X BOA VISTA (VIA MIRIAM)', true)
  ON CONFLICT (organization_id, code) DO UPDATE SET name = EXCLUDED.name, active = true;
  INSERT INTO lines (organization_id, code, name, active)
  VALUES (org, '502', 'SÃO PEDRO X TRÊS VENDAS', true)
  ON CONFLICT (organization_id, code) DO UPDATE SET name = EXCLUDED.name, active = true;
  INSERT INTO lines (organization_id, code, name, active)
  VALUES (org, '504A', 'SÃO PEDRO X ALECRIM', true)
  ON CONFLICT (organization_id, code) DO UPDATE SET name = EXCLUDED.name, active = true;
  INSERT INTO lines (organization_id, code, name, active)
  VALUES (org, '505', 'SÃO PEDRO X RETIRO', true)
  ON CONFLICT (organization_id, code) DO UPDATE SET name = EXCLUDED.name, active = true;
  INSERT INTO lines (organization_id, code, name, active)
  VALUES (org, '508', 'SÃO PEDRO X SÃO JOÃO', true)
  ON CONFLICT (organization_id, code) DO UPDATE SET name = EXCLUDED.name, active = true;
  INSERT INTO lines (organization_id, code, name, active)
  VALUES (org, '510A', 'SÃO PEDRO X BALNEÁRIO DAS CONCHAS', true)
  ON CONFLICT (organization_id, code) DO UPDATE SET name = EXCLUDED.name, active = true;
  INSERT INTO lines (organization_id, code, name, active)
  VALUES (org, '510B', 'SÃO PEDRO X BALNEÁRIO (VIA RODOVIA)', true)
  ON CONFLICT (organization_id, code) DO UPDATE SET name = EXCLUDED.name, active = true;
  INSERT INTO lines (organization_id, code, name, active)
  VALUES (org, '510C', 'SÃO PEDRO X BALNEÁRIO (CIRCULAR)', true)
  ON CONFLICT (organization_id, code) DO UPDATE SET name = EXCLUDED.name, active = true;
  INSERT INTO lines (organization_id, code, name, active)
  VALUES (org, '514', 'SÃO PEDRO X RUA DO FOGO', true)
  ON CONFLICT (organization_id, code) DO UPDATE SET name = EXCLUDED.name, active = true;
  INSERT INTO lines (organization_id, code, name, active)
  VALUES (org, '516', 'SÃO PEDRO X FARMÁCIA VELHA', true)
  ON CONFLICT (organization_id, code) DO UPDATE SET name = EXCLUDED.name, active = true;
  INSERT INTO lines (organization_id, code, name, active)
  VALUES (org, '518', 'SÃO PEDRO X SAPEATIBA MIRIM II', true)
  ON CONFLICT (organization_id, code) DO UPDATE SET name = EXCLUDED.name, active = true;
  INSERT INTO lines (organization_id, code, name, active)
  VALUES (org, '519', 'SÃO PEDRO X BOTAFOGO', true)
  ON CONFLICT (organization_id, code) DO UPDATE SET name = EXCLUDED.name, active = true;
  INSERT INTO lines (organization_id, code, name, active)
  VALUES (org, '519B', 'SÃO PEDRO X BOTAFOGO (VIA MIRIAM)', true)
  ON CONFLICT (organization_id, code) DO UPDATE SET name = EXCLUDED.name, active = true;
  INSERT INTO lines (organization_id, code, name, active)
  VALUES (org, '520', 'SÃO PEDRO X JARDIM PRIMAVERA', true)
  ON CONFLICT (organization_id, code) DO UPDATE SET name = EXCLUDED.name, active = true;
END $$;
