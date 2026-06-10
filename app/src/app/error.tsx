"use client"; // Граница ошибок должна быть клиентским компонентом.

import { useEffect } from "react";
import Link from "next/link";

// Экран на случай непредвиденной ошибки в любом разделе.
// В Next.js 16.2 для повтора используется unstable_retry (раньше — reset).
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // Пишем в консоль — позже подключим нормальное логирование (Фаза C).
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-4 text-center">
      <h1 className="text-2xl font-semibold text-gray-900">Что-то пошло не так</h1>
      <p className="max-w-md text-gray-600">
        Произошла непредвиденная ошибка. Попробуй ещё раз — обычно это помогает.
      </p>
      <div className="mt-2 flex items-center gap-3">
        <button
          onClick={() => unstable_retry()}
          className="rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          Попробовать снова
        </button>
        <Link
          href="/dashboard"
          className="rounded-md border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          В кабинет
        </Link>
      </div>
    </main>
  );
}
