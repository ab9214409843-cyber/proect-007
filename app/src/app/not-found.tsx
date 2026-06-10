import Link from "next/link";

// Экран «страница не найдена»: срабатывает на notFound() (например, карточка
// несуществующего мероприятия) и на любой неизвестный URL.
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper-2 p-4 text-center">
      <p className="font-serif text-6xl font-semibold text-sand">404</p>
      <h1 className="font-serif text-2xl font-semibold text-espresso">
        Страница не найдена
      </h1>
      <p className="max-w-md text-muted">
        Возможно, запись удалена или ссылка устарела.
      </p>
      <div className="mt-2 flex items-center gap-3">
        <Link
          href="/dashboard"
          className="rounded-full bg-espresso px-5 py-2 text-sm font-medium text-paper transition hover:bg-espresso-7"
        >
          В кабинет
        </Link>
        <Link
          href="/"
          className="rounded-md border border-sand bg-card px-5 py-2 text-sm font-medium text-espresso transition hover:bg-paper-2"
        >
          На главную
        </Link>
      </div>
    </main>
  );
}
