"use client"; // Граница ошибок должна быть клиентским компонентом.

import { useEffect } from "react";
import Link from "next/link";

// Ошибка внутри раздела кабинета — рендерится внутри layout (меню остаётся на месте).
export default function CabinetError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
      <h1 className="text-xl font-semibold text-gray-900">Что-то пошло не так</h1>
      <p className="mt-2 text-gray-600">
        Не удалось загрузить раздел. Попробуй ещё раз.
      </p>
      <div className="mt-5 flex items-center justify-center gap-3">
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
    </div>
  );
}
