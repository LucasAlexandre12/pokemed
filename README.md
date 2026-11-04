# PokeMed

Plataforma de organização e estudos médicos.

## Configuração de produção (Vercel + Supabase)

Configure estas variáveis em **Vercel → Project → Settings → Environment Variables** e faça um novo deploy:

- `VITE_SUPABASE_URL`: URL base do projeto Supabase (sem `/rest/v1/`).
- `VITE_SUPABASE_ANON_KEY`: chave pública `sb_publishable_...` da página Settings → API Keys. Não use `sb_secret_` nem `service_role`.
- `GEMINI_API_KEY`: chave da API Gemini para habilitar o assistente de IA (opcional). Esta variável não deve ter prefixo `VITE_`.

O projeto utiliza `public.user_app_data`, com uma linha por usuário e políticas RLS. Execute no SQL Editor do Supabase:

```sql
create table if not exists public.user_app_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.user_app_data enable row level security;
create policy "Users can read own data" on public.user_app_data for select to authenticated using (auth.uid() = user_id);
create policy "Users can insert own data" on public.user_app_data for insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update own data" on public.user_app_data for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

Se as políticas já existirem, não execute novamente os `create policy`. O primeiro login sem registro na nuvem migra os dados locais deste navegador. Se já existir um registro na nuvem, ele será a fonte usada para restaurar os dados. Exporte um backup antes de trocar de dispositivo.

## Desenvolvimento

```bash
npm install
npm run dev
```
