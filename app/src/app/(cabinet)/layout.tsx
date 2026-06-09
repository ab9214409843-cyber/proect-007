import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import Nav from "./nav";

// Общий каркас личного кабинета: боковое меню + шапка с email и выходом.
// Авторизацию также проверяет proxy.ts — здесь подстраховка и получение email.
export default async function CabinetLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Боковое меню */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-gray-200 bg-white p-4 sm:flex">
        <Link
          href="/dashboard"
          className="mb-6 px-3 text-sm font-semibold tracking-widest text-gray-900"
        >
          PROECT_007
        </Link>
        <Nav />
      </aside>

      {/* Основная часть */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Шапка */}
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
          {/* Меню для узких экранов */}
          <div className="sm:hidden">
            <Nav />
          </div>
          <span className="hidden text-sm text-gray-500 sm:inline">
            {user.email}
          </span>
          <form action={signOut} className="ml-auto sm:ml-0">
            <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100">
              Выйти
            </button>
          </form>
        </header>

        {/* Контент раздела */}
        <main className="flex-1 p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
