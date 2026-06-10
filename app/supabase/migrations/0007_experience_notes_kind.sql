-- Этап 8: блок опыта.
-- Добавляем «тип вывода» к заметкам опыта: что прошло хорошо / ошибка / что улучшить.
-- Тема (category) уже есть с миграции 0001. Колонка nullable, без дефолта — старые записи
-- остаются валидными; в форме по умолчанию подставляется 'positive'.

alter table public.experience_notes
  add column if not exists kind text
    check (kind in ('positive', 'negative', 'improvement'));
