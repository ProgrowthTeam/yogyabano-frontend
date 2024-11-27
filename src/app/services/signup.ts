import { supabase } from "../lib/supabaseClient";

export async function signUpUser(email: string, password: string, options?: any) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        ...options,
      }
    },
  });

  return { data, error };
}
