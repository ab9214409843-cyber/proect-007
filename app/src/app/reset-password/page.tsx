import { updatePassword } from "./actions";
import { btnPrimary, inputBase } from "@/components/ui";

// Установка нового пароля. Открывается по ссылке из письма (сессия восстановления
// уже установлена). По образцу страницы регистрации.
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper-2 p-4">
      <div className="w-full max-w-sm rounded-lg border border-sand bg-card p-8 shadow-sm">
        <h1 className="mb-2 font-serif text-2xl font-semibold tracking-tight text-espresso">
          Новый пароль
        </h1>
        <p className="mb-6 text-sm text-muted">
          Придумай новый пароль — минимум 8 символов.
        </p>

        {error && (
          <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <form className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm text-espresso">
            Новый пароль
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className={inputBase}
            />
          </label>
          <button formAction={updatePassword} className={btnPrimary + " mt-2"}>
            Сохранить пароль
          </button>
        </form>
      </div>
    </main>
  );
}
