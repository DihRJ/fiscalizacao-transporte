# Instruções para Configuração do Supabase

## Passo 4: Configurar o Supabase e executar scripts SQL

### 4.1 Após criar o projeto no Supabase:

1. **Aguarde a criação do projeto** (pode levar alguns minutos)
2. **Acesse o SQL Editor** no painel do Supabase
3. **Execute os scripts na seguinte ordem:**

### 4.2 Scripts SQL obrigatórios (executar na ordem):

1. **schema.sql** - Cria todas as tabelas e estrutura do banco
2. **seed.sql** - Insere dados iniciais necessários
3. **migration_invites.sql** - Sistema de convites e expiração de papéis

### 4.3 Scripts SQL opcionais (dados de exemplo):

4. **seed_lines_real.sql** - Linhas de ônibus de exemplo
5. **seed_vehicles_real.sql** - Veículos de exemplo  
6. **seed_trips_week_real.sql** ou **seed_trips_week_custom.sql** - Viagens de exemplo

### 4.4 Obter variáveis de ambiente:

Após executar os scripts, você precisará obter:

- **NEXT_PUBLIC_SUPABASE_URL** - URL do projeto
- **NEXT_PUBLIC_SUPABASE_ANON_KEY** - Chave anônima
- **SUPABASE_SERVICE_ROLE** - Chave de service role

Essas informações estão em: **Settings → API**

### 4.5 Configurar Storage (opcional):

Se necessário, criar bucket para uploads:
- Ir em **Storage**
- Criar bucket público chamado "uploads"

## Próximos passos após Supabase:

1. Configurar variáveis de ambiente na aplicação
2. Fazer deploy da aplicação
3. Testar funcionalidades

---

**Nota:** Todos os arquivos SQL estão na pasta `_SUPABASEbundle/` do projeto.
