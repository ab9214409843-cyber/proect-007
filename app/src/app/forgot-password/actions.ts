"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Запрос ссылки для сброса пароля. Письмо со ссылкой отправляет Supabase.
// Ссылка из письма ведёт на /auth/confirm (verifyOtp) → /reset-password.
export async function requestPasswordReset(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();

  if (email) {
    const supabase = await createClient();
    const h = await headers(); // В Next.js 16 headers() асинхронный.
    const origin = h.get("origin") ?? "";
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/confirm?next=/reset-password`,
    });
  }

  // Всегда одинаковый ответ — не раскрываем, существует ли аккаунт с таким email.
  redirect(
    `/login?info=${encodeURIComponent(
      "Если такой email есть, мы отправили письмо со ссылкой для сброса пароля.",
    )}`,
  );
}
