import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import Nav from "./nav";
import MobileNav from "./MobileNav";
import { btnSecondary } from "@/components/ui";

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
    <div className="flex min-h-screen bg-paper">
      {/* Боковое меню */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-sand bg-card p-4 sm:flex">
        <Link
          href="/dashboard"
          className="mb-6 px-3 font-serif text-xl font-semibold tracking-tight text-espresso"
        >
          Event<span className="text-clay">OS</span>
        </Link>
        <Nav />
      </aside>

      {/* Основная часть */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Шапка */}
        <header className="relative flex items-center gap-4 border-b border-sand bg-card px-6 py-3">
          {/* Меню-гамбургер для узких экранов */}
          <MobileNav />
          <span className="hidden text-sm text-muted sm:inline">
            {user.email}
          </span>
          <form action={signOut} className="ml-auto">
            <button className={btnSecondary}>Выйти</button>
          </form>
        </header>

        {/* Контент раздела */}
        <main className="flex-1 p-6 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
