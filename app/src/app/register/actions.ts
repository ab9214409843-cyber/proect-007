"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { type AuthError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// Понятные сообщения вместо технических (Supabase часто отвечает на английском).
function describeSignupError(error: AuthError): string {
  switch (error.code) {
    case "user_already_exists":
    case "email_exists":
      return "Пользователь с такой почтой уже зарегистрирован. Попробуй войти.";
    case "weak_password":
      return "Пароль слишком простой — нужно минимум 8 символов (и не из утёкших).";
    case "email_address_invalid":
      return "Похоже, email указан неверно.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "Слишком много попыток подряд. Подожди немного и попробуй снова.";
    default:
      return error.message;
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect(
      `/register?error=${encodeURIComponent(describeSignupError(error))}`,
    );
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
