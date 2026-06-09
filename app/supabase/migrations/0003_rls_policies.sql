-- Этап 3. Row Level Security: каждый пользователь видит и меняет только свои записи.

-- Включаем RLS на всех таблицах.
alter table public.users enable row level security;
alter table public.events enable row level security;
alter table public.tasks enable row level security;
alter table public.documents enable row level security;
alter table public.checklist_templates enable row level security;
alter table public.experience_notes enable row level security;

-- users: пользователь видит и правит только свой профиль. Вставку делает триггер (security definer).
create policy "users_select_own" on public.users
  for select to authenticated using ((select auth.uid()) = id);
create policy "users_update_own" on public.users
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- events: владелец = user_id.
create policy "events_select_own" on public.events
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "events_insert_own" on public.events
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "events_update_own" on public.events
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "events_delete_own" on public.events
  for delete to authenticated using ((select auth.uid()) = user_id);

-- tasks.
create policy "tasks_select_own" on public.tasks
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "tasks_insert_own" on public.tasks
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "tasks_update_own" on public.tasks
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "tasks_delete_own" on public.tasks
  for delete to authenticated using ((select auth.uid()) = user_id);

-- documents.
create policy "documents_select_own" on public.documents
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "documents_insert_own" on public.documents
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "documents_update_own" on public.documents
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "documents_delete_own" on public.documents
  for delete to authenticated using ((select auth.uid()) = user_id);

-- experience_notes.
create policy "experience_notes_select_own" on public.experience_notes
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "experience_notes_insert_own" on public.experience_notes
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "experience_notes_update_own" on public.experience_notes
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "experience_notes_delete_own" on public.experience_notes
  for delete to authenticated using ((select auth.uid()) = user_id);

-- checklist_templates: справочник — только чтение для вошедших. Наполняется миграциями (роль с повышенными правами обходит RLS).
create policy "checklist_templates_select_all" on public.checklist_templates
  for select to authenticated using (true);
