import { sendMail } from '@/lib/mailer';
import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { requireRole, getUserFromRequest } from '@/lib/authServer';
import { logAudit } from '@/lib/audit';

export async function POST(req: NextRequest){
  // Create invite (admin only)
  const body = await req.json();
  await requireRole(req, body.organization_id, ['admin']);
  const admin = supabaseAdmin();
  const token = crypto.randomUUID();
  const expires = body.expires_at ? new Date(body.expires_at).toISOString() : new Date(Date.now()+7*864e5).toISOString();
  const { error } = await admin.from('invitations').insert({
    organization_id: body.organization_id, email: body.email, role: body.role, token, expires_at: expires
  });
  if (error) return new Response(JSON.stringify({ ok:false, error: error.message }), { status: 400 });
  const url = `${new URL(req.url).origin}/invite/${token}`;
  await logAudit({ organization_id: body.organization_id, action:'invitation.create', entity:'invitations', entity_id: null, summary: { email: body.email, role: body.role } });
  await sendMail(body.email, 'Convite — Fiscalização de Ônibus', `<p>Você foi convidado para a organização.</p><p>Acesse: <a href='${url}'>${url}</a></p>`);
  return new Response(JSON.stringify({ ok:true, url }), { status: 200 });
}

export async function PATCH(req: NextRequest){
  // Accept invite (authenticated user)
  const body = await req.json();
  const admin = supabaseAdmin();
  const { data: inv, error } = await admin.from('invitations').select('*').eq('token', body.token).is('used_at', null).limit(1);
  if (error || !inv || !inv[0]) return new Response(JSON.stringify({ ok:false, error:'invalid token' }), { status: 400 });
  const invite = inv[0];
  if (new Date(invite.expires_at).getTime() < Date.now()) return new Response(JSON.stringify({ ok:false, error:'expired' }), { status: 400 });

  const user = await getUserFromRequest(req);
  if (!user) return new Response(JSON.stringify({ ok:false, error:'unauthenticated' }), { status: 401 });
  if (user.email?.toLowerCase() !== (invite.email as string).toLowerCase()) {
    return new Response(JSON.stringify({ ok:false, error:'email mismatch' }), { status: 403 });
  }

  // create membership if not exists
  const { data: mem } = await admin.from('memberships').select('user_id').eq('organization_id', invite.organization_id).eq('user_id', user.id).limit(1);
  if (!mem || !mem[0]) {
    const { error: iErr } = await admin.from('memberships').insert({ user_id: user.id, organization_id: invite.organization_id, role: invite.role });
    if (iErr) return new Response(JSON.stringify({ ok:false, error: iErr.message }), { status: 400 });
  }

  await admin.from('invitations').update({ used_at: new Date().toISOString(), created_by: user.id }).eq('id', invite.id);
  await logAudit({ organization_id: invite.organization_id, user_id: user.id, action:'invitation.accept', entity:'invitations', entity_id: invite.id, summary: {} });
  return new Response(JSON.stringify({ ok:true }), { status: 200 });
}
