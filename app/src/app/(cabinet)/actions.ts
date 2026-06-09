"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Выход из аккаунта. Используется в шапке кабинета (layout).
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
