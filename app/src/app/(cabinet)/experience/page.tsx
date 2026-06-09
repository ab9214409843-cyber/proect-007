export default function ExperiencePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold text-gray-900">База опыта</h1>
      <p className="mt-2 text-gray-600">
        Выводы после мероприятий: что прошло хорошо, где ошиблись, что улучшить.
      </p>

      <div className="mt-8 rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-gray-700">Пока нет заметок.</p>
        <p className="mt-1 text-sm text-gray-500">
          Фиксация опыта мероприятий появится на этапе 8.
        </p>
      </div>
    </div>
  );
}
