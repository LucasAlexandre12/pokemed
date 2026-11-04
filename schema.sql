-- Estrutura de armazenamento por usuário do PokeMed.
-- O projeto atual já executou este SQL; arquivo mantido para referência.
create table if not exists public.user_app_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_app_data enable row level security;

-- Execute estas policies apenas se ainda não existirem no projeto.
create policy "Users can read own data"
on public.user_app_data for select to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own data"
on public.user_app_data for insert to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own data"
on public.user_app_data for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
