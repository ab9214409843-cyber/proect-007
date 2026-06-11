"use client"; // Граница ошибок должна быть клиентским компонентом.

import { useEffect } from "react";
import Link from "next/link";
import { btnPrimary, btnSecondary } from "@/components/ui";

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
    <div className="mx-auto max-w-md rounded-lg border border-sand bg-card p-8 text-center shadow-sm">
      <h1 className="font-serif text-xl font-semibold text-espresso">
        Что-то пошло не так
      </h1>
      <p className="mt-2 text-muted">
        Не удалось загрузить раздел. Попробуй ещё раз.
      </p>
      <div className="mt-5 flex items-center justify-center gap-3">
        <button onClick={() => unstable_retry()} className={btnPrimary}>
          Попробовать снова
        </button>
        <Link href="/dashboard" className={btnSecondary}>
          В кабинет
        </Link>
      </div>
    </div>
  );
}
