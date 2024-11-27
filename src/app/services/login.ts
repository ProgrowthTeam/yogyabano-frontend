import { supabase } from "../lib/supabaseClient";

export async function loginUser(email: string, password: string) {
  console.log("Attempting to log in user with email:", email);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Supabase login error:", error);
    return { data: null, error: error.message || "An unknown error occurred" };
  } else {
    console.log("Supabase login data:", data);
    return { data, error: null };
  }
}
