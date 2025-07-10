"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function login(
  prevState: any,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = createClient(await cookies());

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error(error);
    // redirect("/error");
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(
  prevState: any,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = createClient(await cookies());
  const confirmPassword = formData.get("confirm-password") as string;
  const password = formData.get("password") as string;

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: password,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.error(error);
    // redirect("/error");
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logout() {
  const supabase = createClient(await cookies());
  // Log out only the current session
  await supabase.auth.signOut({ scope: "local" });
  revalidatePath("/", "layout");
  redirect("/");
}
