// supabase/functions/sla-notifier/index.ts
// Deno Deploy (supabase edge functions) — send email if OTP below target in last day
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
type Env = { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE: string; SMTP_HOST?: string; SMTP_USER?: string; SMTP_PASS?: string; SMTP_PORT?: string; SMTP_FROM?: string; };

export default async (req: Request) => {
  const env = Deno.env.toObject() as unknown as Env;
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE);
  const since = new Date(Date.now()-24*60*60*1000).toISOString();
  const { data } = await supabase.from('kpi_otp_by_line_day').select('line_id, day, otp_percent').gte('day', since);
  const low = (data||[]).filter((r:any)=>r.otp_percent < 88);
  // TODO: integrate mailer via SMTP (Deno) or external webhook
  return new Response(JSON.stringify({ ok:true, low: low.length }), { headers: { 'Content-Type': 'application/json' } });
}
