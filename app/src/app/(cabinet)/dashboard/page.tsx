import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  formatEventRange,
  statusBadgeClass,
  statusLabel,
} from "@/lib/events";
import {
  daysUntilISO,
  dueState,
  dueStateBadgeClass,
  dueStateLabel,
  todayISO,
} from "@/lib/tasks";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { badgeBase } from "@/components/ui";

// Разделы кабинета — навигация внизу дашборда.
const sections = [
  { href: "/events", title: "Мероприятия", text: "Список мероприятий, статусы и даты." },
  { href: "/tasks", title: "Задачи", text: "Все задачи по подготовке в одном месте." },
  { href: "/documents", title: "Документы", text: "Положение, смета, приказ, сценарий и другое." },
  { href: "/experience", title: "База опыта", text: "Выводы после мероприятий — чтобы не повторять ошибки." },
];

// Русское склонение слова «день» по числу.
function plDays(n: number): string {
  const a = Math.abs(n) % 100;
  const b = a % 10;
  if (a > 10 && a < 20) return "дней";
  if (b === 1) return "день";
  if (b >= 2 && b <= 4) return "дня";
  return "дней";
}

// Подпись «когда» для ближайшего мероприятия по дате начала.
function whenLabel(startDate: string | null): string {
  if (!startDate) return "";
  const d = daysUntilISO(startDate);
  if (d > 0) return `через ${d} ${plDays(d)}`;
  if (d === 0) return "сегодня";
  return "идёт сейчас";
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const today = todayISO();

  // Все счётчики и выборки идут под RLS — возвращается только своё.
  const [
    { count: eventsCount },
    { count: openTasksCount },
    { data: upcoming },
    { data: hotTasks },
  ] = await Promise.all([
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .neq("status", "done"),
    // Ближайшие не завершённые мероприятия — из них в JS выберем актуальное.
    supabase
      .from("events")
      .select("id, title, start_date, end_date, status")
      .neq("status", "done")
      .order("start_date", { ascending: true, nullsFirst: false })
      .limit(5),
    // «Горит сейчас»: незавершённые задачи со сроком сегодня или раньше.
    supabase
      .from("tasks")
      .select("id, title, due_date, status, events(title)")
      .neq("status", "done")
      .not("due_date", "is", null)
      .lte("due_date", today)
      .order("due_date", { ascending: true })
      .limit(6),
  ]);

  // Ближайшее мероприятие: первое идущее или предстоящее (end_date ≥ сегодня),
  // иначе — просто первое из списка незавершённых.
  const nearest =
    (upcoming ?? []).find(
      (e) => (e.end_date ?? e.start_date ?? "") >= today,
    ) ?? (upcoming ?? [])[0];

  // Прогресс задач ближайшего мероприятия.
  let progress: { done: number; total: number } | null = null;
  if (nearest) {
    const [{ count: total }, { count: done }] = await Promise.all([
      supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("event_id", nearest.id),
      supabase
        .from("tasks")
        .select("*", { count: "exact", head: true })
        .eq("event_id", nearest.id)
        .eq("status", "done"),
    ]);
    progress = { done: done ?? 0, total: total ?? 0 };
  }

  const hot = hotTasks ?? [];
  const pct =
    progress && progress.total > 0
      ? Math.round((progress.done / progress.total) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Обзор"
        description={
          user?.email
            ? `Привет, ${user.email}! Вот что происходит с подготовкой.`
            : "Вот что происходит с подготовкой."
        }
      />

      {!eventsCount ? (
        <EmptyState
          title="Пока нет ни одного мероприятия."
          hint="Создай первое мероприятие — план подготовки появится автоматически."
        />
      ) : (
        <>
          {/* Счётчики */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-sand bg-card p-5 shadow-sm shadow-espresso/5">
              <p className="text-xs uppercase tracking-wide text-muted">Мероприятий</p>
              <p className="mt-1 font-serif text-3xl font-semibold text-espresso">
                {eventsCount}
              </p>
            </div>
            <div className="rounded-2xl border border-sand bg-card p-5 shadow-sm shadow-espresso/5">
              <p className="text-xs uppercase tracking-wide text-muted">Открытых задач</p>
              <p className="mt-1 font-serif text-3xl font-semibold text-espresso">
                {openTasksCount ?? 0}
              </p>
            </div>
          </div>

          {/* Ближайшее мероприятие */}
          {nearest && (
            <section className="mt-6 rounded-2xl border border-sand bg-card p-5 shadow-sm shadow-espresso/5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">
                Ближайшее мероприятие
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Link
                  href={`/events/${nearest.id}`}
                  className="font-serif text-xl font-semibold text-espresso hover:underline"
                >
                  {nearest.title}
                </Link>
                <span className={badgeBase + " " + statusBadgeClass(nearest.status)}>
                  {statusLabel(nearest.status)}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted">
                {formatEventRange(nearest.start_date, nearest.end_date)}
                {nearest.start_date && <> · {whenLabel(nearest.start_date)}</>}
              </p>

              {progress && progress.total > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-muted">
                    <span>Готово {progress.done} из {progress.total}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-paper-2">
                    <div
                      className="h-full rounded-full bg-clay"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Горит сейчас */}
          <section className="mt-6">
            <h2 className="font-serif text-lg font-semibold text-espresso">
              Горит сейчас
            </h2>
            {hot.length === 0 ? (
              <p className="mt-3 rounded-2xl border border-sand bg-card p-5 text-sm text-muted shadow-sm shadow-espresso/5">
                Всё под контролем — просроченных и сегодняшних задач нет.
              </p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2">
                {hot.map((task) => {
                  const ds = dueState(task.due_date, task.status);
                  const ev = Array.isArray(task.events)
                    ? task.events[0]
                    : task.events;
                  return (
                    <li
                      key={task.id}
                      className={
                        "flex items-center justify-between gap-4 rounded-xl border bg-card p-4 shadow-sm shadow-espresso/5 " +
                        (ds === "overdue" ? "border-danger/40" : "border-sand")
                      }
                    >
                      <Link href={`/tasks/${task.id}`} className="min-w-0 flex-1">
                        <p className="font-medium text-espresso hover:underline">
                          {task.title}
                        </p>
                        {ev && (
                          <p className="mt-0.5 text-sm text-muted">
                            {ev.title}
                          </p>
                        )}
                      </Link>
                      <span className={badgeBase + " shrink-0 " + dueStateBadgeClass(ds)}>
                        {dueStateLabel(ds)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}

      {/* Навигация по разделам */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-lg border border-sand bg-card p-5 shadow-sm transition hover:shadow"
          >
            <h2 className="font-semibold text-espresso">{s.title}</h2>
            <p className="mt-1 text-sm text-muted">{s.text}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
