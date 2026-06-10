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
  todo: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-800",
  review: "bg-amber-100 text-amber-800",
  done: "bg-green-100 text-green-800",
};

export function taskStatusBadgeClass(code: string): string {
  return TASK_STATUS_BADGE[code] ?? "bg-gray-100 text-gray-700";
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
  low: "bg-gray-100 text-gray-600",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-red-100 text-red-800",
};

export function taskPriorityBadgeClass(code: string): string {
  return TASK_PRIORITY_BADGE[code] ?? "bg-gray-100 text-gray-600";
}

// Сдвиг даты 'YYYY-MM-DD' на указанное число дней (UTC, чтобы срок не «съезжал» из-за часового
// пояса). Используется для автоплана: due_date = addDaysISO(start_date, -offset_days).
export function addDaysISO(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
