
# Schedules customizáveis
- Arquivo de configuração: `service_config.json`
  - `per_line`: headways e duração por linha (ex.: 501A pico=10 min, entrepico=20; 510A duração 38 min; 510C marcada como circular).
  - `calendar`: blocos de serviço por tipo de dia (weekday/saturday/sunday).
- Arquivos gerados:
  - `trips_week_custom.csv`
  - `seed_trips_week_custom.sql`

## Importação
- SQL (recomendado): rode `seed_trips_week_custom.sql` após ajustar o UUID `org`.
- CSV: `POST /api/trips/import` com `trips_week_custom.csv`.
