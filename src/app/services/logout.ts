import { supabase } from "../lib/supabaseClient";

export async function logout() {
  const { error } = await supabase.auth.signOut();

  return { error };
}
