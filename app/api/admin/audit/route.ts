import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireRole } from '@/lib/authServer';

export async function GET(req: NextRequest){
  const url = new URL(req.url);
  const organization_id = url.searchParams.get('organization_id');
  await requireRole(req, organization_id, ['admin','supervisor','auditor']);
  const admin = supabaseAdmin();
  let q = admin.from('audit_logs').select('created_at, user_id, action, entity, entity_id, summary').order('created_at', { ascending: false }).limit(1000);
  if (organization_id) q = q.eq('organization_id', organization_id);
  const start = url.searchParams.get('start');
  const end = url.searchParams.get('end');
  if (start) q = q.gte('created_at', start);
  if (end) q = q.lte('created_at', end);
  const { data, error } = await q;
  if (error) return new Response(JSON.stringify({ ok:false, error: error.message }), { status: 400 });
  return new Response(JSON.stringify({ ok:true, data }), { status: 200 });
}
