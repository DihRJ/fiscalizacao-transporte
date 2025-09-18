import { supabaseAdmin } from './supabaseAdmin';

export async function logAudit(opts: { organization_id?: string|null, user_id?: string|null, action: string, entity?: string|null, entity_id?: string|null, summary?: any }){
  try{
    const admin = supabaseAdmin();
    const row = {
      organization_id: opts.organization_id || null,
      user_id: opts.user_id || null,
      action: opts.action,
      entity: opts.entity || null,
      entity_id: opts.entity_id || null,
      summary: opts.summary ? (typeof opts.summary === 'string' ? opts.summary : JSON.stringify(opts.summary)) : null,
      ip: null,
      user_agent: null
    };
    await admin.from('audit_logs').insert(row);
  }catch(e){ /* noop in MVP */ }
}
