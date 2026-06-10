"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Установка нового пароля. Сессия восстановления уже открыта ссылкой из письма
// (через /auth/confirm → verifyOtp). RLS и Supabase знают, кто пользователь.
export async function updatePassword(formData: FormData) {
  const password = String(formData.get("password") ?? "");

  if (password.length < 8) {
    redirect(
      `/reset-password?error=${encodeURIComponent("Пароль должен быть не короче 8 символов.")}`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(
      `/reset-password?error=${encodeURIComponent(
        "Не удалось сменить пароль. Ссылка могла устареть — запроси её заново.",
      )}`,
    );
  }

  revalidatePath("/", "layout");
  redirect(
    `/login?info=${encodeURIComponent("Пароль обновлён. Войди с новым паролем.")}`,
  );
}
