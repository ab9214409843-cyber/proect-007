export default function DocumentsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold text-gray-900">Документы</h1>
      <p className="mt-2 text-gray-600">
        Положение, смета, приказ, сценарий и другие файлы — рядом с мероприятием.
      </p>

      <div className="mt-8 rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center">
        <p className="text-gray-700">Пока нет документов.</p>
        <p className="mt-1 text-sm text-gray-500">
          Загрузка и хранение документов появятся на этапе 7.
        </p>
      </div>
    </div>
  );
}
