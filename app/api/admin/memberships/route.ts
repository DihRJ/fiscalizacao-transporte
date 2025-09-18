import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireRole } from '@/lib/authServer';
import { logAudit } from '@/lib/audit';

export async function GET(req: NextRequest){
  const url = new URL(req.url);
  const organization_id = url.searchParams.get('organization_id');
  await requireRole(req, organization_id, ['admin','supervisor']);
  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from('memberships')
    .select('user_id, role, organization_id, expires_at')
    .eq('organization_id', organization_id);
  if (error) return new Response(JSON.stringify({ ok:false, error: error.message }), { status: 400 });
  return new Response(JSON.stringify({ ok:true, data }), { status: 200 });
}

export async function POST(req: NextRequest){
  const body = await req.json();
  await requireRole(req, body.organization_id, ['admin']); // only admin
  const admin = supabaseAdmin();
  const { error } = await admin.from('memberships').insert({ user_id: body.user_id, organization_id: body.organization_id, role: body.role, expires_at: body.expires_at || null });
  if (error) return new Response(JSON.stringify({ ok:false, error: error.message }), { status: 400 });
  await logAudit({ organization_id: body.organization_id, user_id: body.user_id, action:'membership.create', entity:'memberships', entity_id: null, summary: { role: body.role } });
  return new Response(JSON.stringify({ ok:true }), { status: 200 });
}

export async function PATCH(req: NextRequest){
  const body = await req.json();
  await requireRole(req, body.organization_id, ['admin']); // only admin
  const admin = supabaseAdmin();
  const { error } = await admin.from('memberships').update({ role: body.role, expires_at: body.expires_at || null }).eq('organization_id', body.organization_id).eq('user_id', body.user_id);
  if (error) return new Response(JSON.stringify({ ok:false, error: error.message }), { status: 400 });
  await logAudit({ organization_id: body.organization_id, user_id: body.user_id, action:'membership.update', entity:'memberships', entity_id: null, summary: { role: body.role } });
  return new Response(JSON.stringify({ ok:true }), { status: 200 });
}

export async function DELETE(req: NextRequest){
  const body = await req.json();
  await requireRole(req, body.organization_id, ['admin']); // only admin
  const admin = supabaseAdmin();
  const { error } = await admin.from('memberships').delete().eq('organization_id', body.organization_id).eq('user_id', body.user_id);
  if (error) return new Response(JSON.stringify({ ok:false, error: error.message }), { status: 400 });
  await logAudit({ organization_id: body.organization_id, user_id: body.user_id, action:'membership.delete', entity:'memberships', entity_id: null, summary: {} });
  return new Response(JSON.stringify({ ok:true }), { status: 200 });
}
