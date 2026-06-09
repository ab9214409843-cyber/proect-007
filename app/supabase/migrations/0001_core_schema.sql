-- Этап 3. Базовая схема: 6 таблиц приложения Proect_007.
-- Значения статусов/типов/категорий хранятся английскими кодами (CHECK), русские подписи — в UI.

-- 1. Профиль пользователя (расширяет auth.users).
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  name text,
  created_at timestamptz not null default now()
);
comment on table public.users is 'Профиль пользователя; id совпадает с auth.users.id. Заполняется триггером handle_new_user.';

-- 2. Мероприятия.
create table public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  event_type text,
  start_date date,
  end_date date,
  location text,
  description text,
  status text not null default 'planned'
    check (status in ('planned', 'preparing', 'in_progress', 'done')),
  created_at timestamptz not null default now()
);
comment on column public.events.status is 'planned=планируется, preparing=в подготовке, in_progress=проводится, done=завершено';
comment on column public.events.event_type is 'Код типа мероприятия; согласуется с checklist_templates.event_type (Этап 5).';

-- 3. Задачи (event_id nullable — задача может быть без мероприятия).
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  due_date date,
  status text not null default 'todo'
    check (status in ('todo', 'in_progress', 'review', 'done')),
  priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high')),
  created_at timestamptz not null default now()
);
comment on column public.tasks.status is 'todo=к выполнению, in_progress=в работе, review=на согласовании, done=выполнено';
comment on column public.tasks.priority is 'low=низкий, medium=средний, high=высокий';

-- 4. Документы (file_url — ссылка на файл в Supabase Storage, bucket заведём на Этапе 7).
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  type text
    check (type in ('regulation', 'rules', 'memo', 'estimate', 'tor', 'scenario', 'report', 'other')),
  file_url text,
  created_at timestamptz not null default now()
);
comment on column public.documents.type is 'regulation=положение, rules=регламент, memo=служебная записка, estimate=смета, tor=ТЗ, scenario=сценарный план, report=отчёт, other=другое';

-- 5. Шаблоны задач для автоплана (справочник, без user_id). Наполним на Этапе 5.
create table public.checklist_templates (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  title text not null,
  offset_days int not null,
  description text
);
comment on table public.checklist_templates is 'Справочник для автогенерации задач (Этап 5). offset_days — за сколько дней до мероприятия.';

-- 6. Заметки опыта.
create table public.experience_notes (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  category text
    check (category in ('organization', 'venue', 'contractors', 'documents', 'participants', 'budget', 'other')),
  created_at timestamptz not null default now()
);
comment on column public.experience_notes.category is 'organization=организация, venue=площадка, contractors=подрядчики, documents=документы, participants=участники, budget=бюджет, other=другое';

-- Индексы для частых выборок.
create index events_user_id_idx on public.events (user_id);
create index tasks_user_id_idx on public.tasks (user_id);
create index tasks_event_id_idx on public.tasks (event_id);
create index documents_user_id_idx on public.documents (user_id);
create index documents_event_id_idx on public.documents (event_id);
create index experience_notes_user_id_idx on public.experience_notes (user_id);
create index experience_notes_event_id_idx on public.experience_notes (event_id);
create index checklist_templates_event_type_idx on public.checklist_templates (event_type);
