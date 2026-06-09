import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Подстраховка помимо middleware.
  if (!user) {
    redirect("/login");
  }

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Личный кабинет</h1>
          <form action={signOut}>
            <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-100">
              Выйти
            </button>
          </form>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-gray-700">
            Привет,{" "}
            <span className="font-medium text-gray-900">{user.email}</span>!
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Это пустой каркас кабинета. Разделы (мероприятия, задачи, документы,
            база опыта) появятся на следующих этапах.
          </p>
        </div>
      </div>
    </main>
  );
}
