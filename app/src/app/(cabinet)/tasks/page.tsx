export default function TasksPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold text-gray-900">Задачи</h1>
      <p className="mt-2 text-gray-600">
        Все задачи по подготовке мероприятий в одном месте.
      </p>

      <div className="mt-8 rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-gray-700">Пока нет задач.</p>
        <p className="mt-1 text-sm text-gray-500">
          Задачи будут создаваться автоматически от даты мероприятия — этапы 5–6.
        </p>
      </div>
    </div>
  );
}
