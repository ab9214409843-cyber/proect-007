import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <h1 className="text-4xl font-bold text-gray-900">Proect_007</h1>
      <p className="mt-4 max-w-md text-gray-600">
        Сервис для организаторов мероприятий: создать мероприятие, получить
        автоматический план подготовки, вести задачи, хранить документы и
        фиксировать опыт.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/login"
          className="rounded-md bg-gray-900 px-6 py-2 text-white transition hover:bg-gray-700"
        >
          Войти
        </Link>
        <Link
          href="/register"
          className="rounded-md border border-gray-300 bg-white px-6 py-2 text-gray-900 transition hover:bg-gray-100"
        >
          Регистрация
        </Link>
      </div>
    </main>
  );
}
