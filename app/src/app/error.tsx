"use client"; // Граница ошибок должна быть клиентским компонентом.

import { useEffect } from "react";
import Link from "next/link";
import { btnPrimary, btnSecondary } from "@/components/ui";

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
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper-2 p-4 text-center">
      <h1 className="font-serif text-2xl font-semibold text-espresso">
        Что-то пошло не так
      </h1>
      <p className="max-w-md text-muted">
        Произошла непредвиденная ошибка. Попробуй ещё раз — обычно это помогает.
      </p>
      <div className="mt-2 flex items-center gap-3">
        <button onClick={() => unstable_retry()} className={btnPrimary}>
          Попробовать снова
        </button>
        <Link href="/dashboard" className={btnSecondary}>
          В кабинет
        </Link>
      </div>
    </main>
  );
}
