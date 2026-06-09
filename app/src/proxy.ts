import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/session";

// В Next.js 16 файл и функция middleware переименованы в proxy (runtime — Node.js).
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Все маршруты, кроме статики и картинок.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
