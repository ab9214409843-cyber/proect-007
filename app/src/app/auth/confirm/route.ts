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

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (!error) {
      // Почта подтверждена, сессия установлена — в кабинет.
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.redirect(
    new URL(
      `/login?error=${encodeURIComponent("Ссылка подтверждения недействительна или устарела. Войди по email и паролю.")}`,
      request.url,
    ),
  );
}
