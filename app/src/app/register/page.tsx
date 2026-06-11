import Link from "next/link";
import { signup } from "./actions";
import { alertError, btnPrimary, inputBase } from "@/components/ui";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper-2 p-4">
      <div className="w-full max-w-sm rounded-lg border border-sand bg-card p-8 shadow-sm">
        <h1 className="mb-6 font-serif text-2xl font-semibold tracking-tight text-espresso">Регистрация</h1>

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
              autoComplete="new-password"
              className={inputBase}
            />
          </label>
          <button formAction={signup} className={btnPrimary + " mt-2"}>
            Зарегистрироваться
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="font-medium text-espresso underline">
            Войти
          </Link>
        </p>
      </div>
    </main>
  );
}
