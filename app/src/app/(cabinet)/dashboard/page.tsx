import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";

const sections = [
  {
    href: "/events",
    title: "Мероприятия",
    text: "Список мероприятий, статусы и даты.",
  },
  {
    href: "/tasks",
    title: "Задачи",
    text: "Все задачи по подготовке в одном месте.",
  },
  {
    href: "/documents",
    title: "Документы",
    text: "Положение, смета, приказ, сценарий и другое.",
  },
  {
    href: "/experience",
    title: "База опыта",
    text: "Выводы после мероприятий — чтобы не повторять ошибки.",
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader title="Обзор" />
      <p className="mt-2 text-gray-600">
        Привет,{" "}
        <span className="font-medium text-gray-900">{user?.email}</span>! Это
        личный кабинет. Выбери раздел, чтобы продолжить.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow"
          >
            <h2 className="font-semibold text-gray-900">{s.title}</h2>
            <p className="mt-1 text-sm text-gray-600">{s.text}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
