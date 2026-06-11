import Link from "next/link";
import { login } from "./actions";
import { alertError, alertSuccess, btnPrimary, inputBase } from "@/components/ui";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; info?: string }>;
}) {
  const { error, info } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper-2 p-4">
      <div className="w-full max-w-sm rounded-lg border border-sand bg-card p-8 shadow-sm">
        <h1 className="mb-6 font-serif text-2xl font-semibold tracking-tight text-espresso">Вход</h1>

        {info && <p className={"mb-4 " + alertSuccess}>{info}</p>}
        {error && <p className={"mb-4 " + alertError}>{error}</p>}

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
          <label className="flex flex-col gap-1 text-sm text-espresso">
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

        <p className="mt-4 text-center text-sm text-muted">
          <Link
            href="/forgot-password"
            className="font-medium text-espresso underline"
          >
            Забыли пароль?
          </Link>
        </p>

        <p className="mt-2 text-center text-sm text-muted">
          Нет аккаунта?{" "}
          <Link href="/register" className="font-medium text-espresso underline">
            Регистрация
          </Link>
        </p>
      </div>
    </main>
  );
}
