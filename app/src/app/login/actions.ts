"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    const notConfirmed =
      error.code === "email_not_confirmed" ||
      /not confirmed/i.test(error.message);
    const message = notConfirmed
      ? "Почта ещё не подтверждена. Открой письмо от Supabase, перейди по ссылке — и войди снова."
      : "Не удалось войти. Проверь email и пароль.";
    redirect(`/login?error=${encodeURIComponent(message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
