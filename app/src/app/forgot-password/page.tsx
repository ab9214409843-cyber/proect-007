import Link from "next/link";
import { requestPasswordReset } from "./actions";
import { btnPrimary, inputBase } from "@/components/ui";

// Запрос ссылки для сброса пароля. По образцу страницы входа.
export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper-2 p-4">
      <div className="w-full max-w-sm rounded-lg border border-sand bg-card p-8 shadow-sm">
        <h1 className="mb-2 font-serif text-2xl font-semibold tracking-tight text-espresso">
          Сброс пароля
        </h1>
        <p className="mb-6 text-sm text-muted">
          Укажи email — пришлём ссылку для смены пароля.
        </p>

        {error && (
          <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <form className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm text-espresso">
            Email
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className={inputBase}
            />
          </label>
          <button formAction={requestPasswordReset} className={btnPrimary + " mt-2"}>
            Отправить ссылку
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Вспомнил пароль?{" "}
          <Link href="/login" className="font-medium text-espresso underline">
            Войти
          </Link>
        </p>
      </div>
    </main>
  );
}
