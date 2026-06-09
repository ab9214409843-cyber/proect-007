# Черновик схемы базы данных

Шесть таблиц из Этапа 3. Это черновик-ориентир — точный SQL под Supabase подготовим на Этапе 3.
Тип `id` в Supabase обычно `uuid` (генерируется автоматически), `created_at` — `timestamptz` (по умолчанию `now()`).

## users — пользователи
В Supabase часть данных живёт в встроенной таблице авторизации (`auth.users`). Здесь — профиль.

| Поле | Тип | Описание |
|---|---|---|
| id | uuid | идентификатор (= id из auth.users) |
| email | text | почта |
| name | text | имя |
| created_at | timestamptz | когда создан |

## events — мероприятия

| Поле | Тип | Описание |
|---|---|---|
| id | uuid | идентификатор |
| user_id | uuid | владелец (ссылка на users) |
| title | text | название |
| event_type | text | тип мероприятия (влияет на шаблон задач) |
| start_date | date | дата начала |
| end_date | date | дата окончания |
| location | text | место проведения |
| description | text | описание |
| status | text | планируется / в подготовке / проводится / завершено |
| created_at | timestamptz | когда создано |

## tasks — задачи

| Поле | Тип | Описание |
|---|---|---|
| id | uuid | идентификатор |
| event_id | uuid | мероприятие (ссылка на events) |
| user_id | uuid | владелец |
| title | text | название |
| description | text | описание |
| due_date | date | срок |
| status | text | к выполнению / в работе / на согласовании / выполнено |
| priority | text | приоритет |
| created_at | timestamptz | когда создана |

## documents — документы

| Поле | Тип | Описание |
|---|---|---|
| id | uuid | идентификатор |
| event_id | uuid | мероприятие |
| user_id | uuid | владелец |
| title | text | название |
| type | text | положение / регламент / служебная записка / смета / ТЗ / сценарный план / отчёт / другое |
| file_url | text | ссылка на файл в Supabase Storage |
| created_at | timestamptz | когда загружен |

## checklist_templates — шаблоны задач для автоплана

Из этих строк система собирает задачи при создании мероприятия (Этап 5).

| Поле | Тип | Описание |
|---|---|---|
| id | uuid | идентификатор |
| event_type | text | для какого типа мероприятия |
| title | text | название задачи |
| offset_days | int | за сколько дней до мероприятия (например 90, 60, 30, 7, 1) |
| description | text | описание |

> На Этапе 5 наполняем эту таблицу реальными этапами из методички ФЦ БАС
> (`C:\Claude_Code\methodology\methodology.md`).

## experience_notes — заметки опыта

| Поле | Тип | Описание |
|---|---|---|
| id | uuid | идентификатор |
| event_id | uuid | мероприятие |
| user_id | uuid | владелец |
| title | text | заголовок |
| description | text | текст вывода |
| category | text | организация / площадка / подрядчики / документы / участники / бюджет / другое |
| created_at | timestamptz | когда создана |

## Связи (кратко)

- один **user** → много **events**, **tasks**, **documents**, **experience_notes**;
- одно **event** → много **tasks**, **documents**, **experience_notes**;
- **checklist_templates** ни с чем не связана напрямую — это справочник для генерации задач.

## Доступ к данным

В Supabase включаем **RLS** (защиту строк): каждый пользователь видит только свои записи
(`user_id = текущий пользователь`). Настроим на Этапе 3.
