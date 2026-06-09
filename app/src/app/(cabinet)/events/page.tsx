export default function EventsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Мероприятия</h1>
        <button
          disabled
          title="Появится на этапе 4"
          className="cursor-not-allowed rounded-md bg-gray-300 px-4 py-2 text-sm font-medium text-white"
        >
          Создать
        </button>
      </div>

      <div className="mt-8 rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-gray-700">Пока нет мероприятий.</p>
        <p className="mt-1 text-sm text-gray-500">
          Создание мероприятий и автоматический план подготовки появятся на
          этапах 4–5.
        </p>
      </div>
    </div>
  );
}
