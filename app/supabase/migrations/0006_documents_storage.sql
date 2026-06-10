-- Этап 7. Хранилище документов: приватный бакет, RLS на storage.objects, доп. колонки.

-- Приватный бакет для файлов документов (лимит 25 МБ). Приватный — прямых ссылок нет,
-- скачивание через подписанные URL.
insert into storage.buckets (id, name, public, file_size_limit)
values ('documents', 'documents', false, 26214400)
on conflict (id) do nothing;

-- RLS на storage.objects: пользователь работает только со своей папкой {user_id}/...
-- (первый сегмент пути = его auth.uid()). Тот же принцип «вижу только своё».
create policy "documents_objects_select_own" on storage.objects
  for select to authenticated
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "documents_objects_insert_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'documents' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "documents_objects_update_own" on storage.objects
  for update to authenticated
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'documents' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "documents_objects_delete_own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'documents' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- Доп. колонки в documents: исходное имя файла и размер (для подписи и отображения).
alter table public.documents add column if not exists file_name text;
alter table public.documents add column if not exists file_size bigint;
comment on column public.documents.file_url is 'Путь объекта в бакете documents ({user_id}/{uuid}.{ext}).';
comment on column public.documents.file_name is 'Исходное имя загруженного файла (для скачивания и подписи).';
comment on column public.documents.file_size is 'Размер файла в байтах.';
