"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect(`/register?error=${encodeURIComponent(error.message)}`);
  }

  // Если включено подтверждение email — сессии ещё нет, сразу в кабинет не пускаем.
  if (!data.session) {
    redirect(
      `/login?info=${encodeURIComponent("Аккаунт создан. Подтверди email по ссылке из письма и войди.")}`,
    );
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
