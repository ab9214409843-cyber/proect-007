import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Принимает ссылку подтверждения email из письма Supabase, подтверждает аккаунт
// и открывает сессию. Письмо должно вести на:
//   {SITE_URL}/auth/confirm?token_hash={{ .TokenHash }}&type=email
// (шаблон письма настраивается в Supabase → Authentication → Email Templates).
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  // next — куда вести после подтверждения. Для сброса пароля = /reset-password.
  // Принимаем только локальный путь (защита от open redirect).
  const nextParam = searchParams.get("next");
  const next =
    nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : "/dashboard";

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) {
      // Сессия установлена. Для recovery ведём на смену пароля, иначе — в кабинет.
      return NextResponse.redirect(new URL(next, request.url));
    }
  }

  return NextResponse.redirect(
    new URL(
      `/login?error=${encodeURIComponent("Ссылка подтверждения недействительна или устарела. Войди по email и паролю.")}`,
      request.url,
    ),
  );
}
