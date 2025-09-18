// supabase/functions/invite-reminder/index.ts
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export default async (_req: Request) => {
  const env = Deno.env.toObject() as any;
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE);
  const soon = new Date(Date.now()+48*60*60*1000).toISOString();
  const { data } = await supabase.from('invitations').select('email, token, expires_at').is('used_at', null).lte('expires_at', soon);
  // TODO: send reminder emails
  return new Response(JSON.stringify({ ok:true, reminders: (data||[]).length }), { headers: { 'Content-Type': 'application/json' } });
}
