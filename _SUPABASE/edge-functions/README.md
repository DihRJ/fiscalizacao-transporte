# Supabase Edge Functions (cron)

Funções de exemplo:
- `sla-notifier.ts`: verifica OTP < 88% nas últimas 24h.
- `invite-reminder.ts`: lembra convites que expiram em 48h.

## Como usar
1. Copie este diretório para `supabase/functions/` no seu repo.
2. CLI:
   ```bash
   supabase functions deploy sla-notifier
   supabase functions deploy invite-reminder
   supabase functions serve sla-notifier
   ```
3. Configure **cron** pelo Dashboard do Supabase (Scheduled Triggers) ou via provedor externo (ex.: GitHub Actions, cron do Vercel chamando a URL da função).

> Estas funções retornam um JSON com contagens; adapte para enviar e-mails ou webhooks internos do seu município.
