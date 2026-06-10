import Link from "next/link";
import { login } from "./actions";
import { btnPrimary, inputBase } from "@/components/ui";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; info?: string }>;
}) {
  const { error, info } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">Вход</h1>

        {info && (
          <p className="mb-4 rounded-md bg-green-50 p-3 text-sm text-green-700">
            {info}
          </p>
        )}
        {error && (
          <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <form className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm text-gray-700">
            Email
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className={inputBase}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-gray-700">
            Пароль
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="current-password"
              className={inputBase}
            />
          </label>
          <button formAction={login} className={btnPrimary + " mt-2"}>
            Войти
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          <Link
            href="/forgot-password"
            className="font-medium text-gray-900 underline"
          >
            Забыли пароль?
          </Link>
        </p>

        <p className="mt-2 text-center text-sm text-gray-600">
          Нет аккаунта?{" "}
          <Link href="/register" className="font-medium text-gray-900 underline">
            Регистрация
          </Link>
        </p>
      </div>
    </main>
  );
}
