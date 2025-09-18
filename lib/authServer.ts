import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from './supabaseAdmin';

const supabaseAnon = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export type Role = 'admin' | 'supervisor' | 'fiscal' | 'auditor' | 'controle';

/** Extracts Bearer token from Authorization header and resolves user */
export async function getUserFromRequest(req: NextRequest){
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return null;
  const { data, error } = await supabaseAnon.auth.getUser(token);
  if (error) return null;
  return data.user;
}

/** Returns the role of the user in the given organization (or null if none) */
export async function getUserRole(user_id: string, organization_id: string): Promise<Role | null> {
  const admin = supabaseAdmin();
  const { data, error } = await admin
    .from('memberships')
    .select('role, expires_at')
    .eq('user_id', user_id)
    .eq('organization_id', organization_id)
    .limit(1);
  if (error || !data || !data[0]) return null;
  
  const row = data[0] as any;
  if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) return null;
  return row.role as Role;

}

/** Requires that the requester is authenticated and has one of the allowed roles in org.
 *  You must pass the org id (from body or query). Returns { user_id, role } or throws Response.
*/
export async function requireRole(req: NextRequest, organization_id: string | null | undefined, allowed: Role[]){
  const user = await getUserFromRequest(req);
  if (!user) throw new Response(JSON.stringify({ ok:false, error:'unauthenticated' }), { status: 401 });
  if (!organization_id) throw new Response(JSON.stringify({ ok:false, error:'organization_id required' }), { status: 400 });
  const role = await getUserRole(user.id, organization_id);
  if (!role || !allowed.includes(role)) {
    throw new Response(JSON.stringify({ ok:false, error:'forbidden' }), { status: 403 });
  }
  return { user_id: user.id, role };
}
