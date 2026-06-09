import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Обновляет сессию Supabase на каждом запросе и защищает приватные маршруты.
// Вызывается из proxy.ts (бывш. middleware — переименован в Next.js 16).
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // ВАЖНО: getUser() обязателен сразу после createServerClient — он обновляет токен.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAuthPage = path === "/login" || path === "/register";
  // Все разделы личного кабинета требуют входа.
  const protectedPrefixes = [
    "/dashboard",
    "/events",
    "/tasks",
    "/documents",
    "/experience",
  ];
  const isProtected = protectedPrefixes.some(
    (p) => path === p || path.startsWith(p + "/"),
  );

  // Неавторизованного на приватную страницу — на вход.
  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Уже вошедшего на страницы входа/регистрации — в кабинет.
  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
