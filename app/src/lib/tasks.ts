// Общие константы и хелперы модуля задач (этап 5).
// Статусы и приоритеты хранятся в БД английскими кодами (CHECK в миграции 0001), подписи — здесь.

import type { Tables } from "@/lib/supabase/database.types";

export type TaskRow = Tables<"tasks">;

// Статусы задачи: код в БД → подпись в интерфейсе (порядок — по ходу работы).
export const TASK_STATUSES = [
  { code: "todo", label: "К выполнению" },
  { code: "in_progress", label: "В работе" },
  { code: "review", label: "На согласовании" },
  { code: "done", label: "Выполнено" },
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number]["code"];

export function taskStatusLabel(code: string): string {
  return TASK_STATUSES.find((s) => s.code === code)?.label ?? code;
}

const TASK_STATUS_BADGE: Record<string, string> = {
  todo: "bg-paper-2 text-muted",
  in_progress: "bg-info-bg text-info",
  review: "bg-warn-bg text-warn",
  done: "bg-success-bg text-success",
};

export function taskStatusBadgeClass(code: string): string {
  return TASK_STATUS_BADGE[code] ?? "bg-paper-2 text-muted";
}

// Приоритеты задачи: код в БД → подпись в интерфейсе.
export const TASK_PRIORITIES = [
  { code: "low", label: "Низкий" },
  { code: "medium", label: "Средний" },
  { code: "high", label: "Высокий" },
] as const;

export type TaskPriority = (typeof TASK_PRIORITIES)[number]["code"];

export function taskPriorityLabel(code: string): string {
  return TASK_PRIORITIES.find((p) => p.code === code)?.label ?? code;
}

const TASK_PRIORITY_BADGE: Record<string, string> = {
  low: "bg-paper-2 text-muted",
  medium: "bg-warn-bg text-warn",
  high: "bg-danger-bg text-danger",
};

export function taskPriorityBadgeClass(code: string): string {
  return TASK_PRIORITY_BADGE[code] ?? "bg-paper-2 text-muted";
}

// Сдвиг даты 'YYYY-MM-DD' на указанное число дней (UTC, чтобы срок не «съезжал» из-за часового
// пояса). Используется для автоплана: due_date = addDaysISO(start_date, -offset_days).
export function addDaysISO(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// Сегодняшняя дата в формате 'YYYY-MM-DD' (UTC — согласовано с addDaysISO и хранением дат).
export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

// Сколько дней от сегодня до даты (UTC). Отрицательное — дата в прошлом, 0 — сегодня.
export function daysUntilISO(dateStr: string): number {
  const day = 24 * 60 * 60 * 1000;
  const target = new Date(`${dateStr}T00:00:00Z`).getTime();
  const today = new Date(`${todayISO()}T00:00:00Z`).getTime();
  return Math.round((target - today) / day);
}

// Состояние срока задачи для подсветки «что горит».
// Выполненные и задачи без срока — нейтральны ('none'). «Скоро» — в пределах SOON_DAYS дней.
export type DueState = "overdue" | "today" | "soon" | "none";

const SOON_DAYS = 3;

export function dueState(dueDate: string | null, status: string): DueState {
  if (!dueDate || status === "done") return "none";
  const diff = daysUntilISO(dueDate);
  if (diff < 0) return "overdue";
  if (diff === 0) return "today";
  if (diff <= SOON_DAYS) return "soon";
  return "none";
}

const DUE_STATE_LABEL: Record<DueState, string> = {
  overdue: "Просрочено",
  today: "Сегодня",
  soon: "Скоро",
  none: "",
};

export function dueStateLabel(state: DueState): string {
  return DUE_STATE_LABEL[state];
}

// Тёплые semantic-классы бейджа состояния срока (см. токены в globals.css).
const DUE_STATE_BADGE: Record<DueState, string> = {
  overdue: "bg-danger-bg text-danger",
  today: "bg-info-bg text-info",
  soon: "bg-warn-bg text-warn",
  none: "bg-paper-2 text-muted",
};

export function dueStateBadgeClass(state: DueState): string {
  return DUE_STATE_BADGE[state];
}
