import Link from "next/link";

// Карточка мероприятия. В Next.js 16 params — асинхронные.
export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const fields = [
    { label: "Название", value: "—" },
    { label: "Дата", value: "—" },
    { label: "Место", value: "—" },
    { label: "Статус", value: "—" },
  ];

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/events"
        className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
      >
        ← К мероприятиям
      </Link>

      <h1 className="mt-3 text-2xl font-semibold text-gray-900">
        Мероприятие #{id}
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Каркас карточки. Данные появятся на этапах 4–6.
      </p>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div
            key={f.label}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <dt className="text-xs uppercase tracking-wide text-gray-500">
              {f.label}
            </dt>
            <dd className="mt-1 text-gray-900">{f.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {["Задачи", "Документы", "Заметки опыта"].map((block) => (
          <div
            key={block}
            className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center"
          >
            <h2 className="font-semibold text-gray-900">{block}</h2>
            <p className="mt-1 text-sm text-gray-500">Появится позже</p>
          </div>
        ))}
      </div>
    </div>
  );
}
