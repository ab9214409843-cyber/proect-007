import Link from "next/link";

// Экран «страница не найдена»: срабатывает на notFound() (например, карточка
// несуществующего мероприятия) и на любой неизвестный URL.
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-4 text-center">
      <p className="text-5xl font-bold text-gray-300">404</p>
      <h1 className="text-2xl font-semibold text-gray-900">Страница не найдена</h1>
      <p className="max-w-md text-gray-600">
        Возможно, запись удалена или ссылка устарела.
      </p>
      <div className="mt-2 flex items-center gap-3">
        <Link
          href="/dashboard"
          className="rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          В кабинет
        </Link>
        <Link
          href="/"
          className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          На главную
        </Link>
      </div>
    </main>
  );
}
