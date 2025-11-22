import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// DEBUG: expor supabase no window para testes manuais no console
// (não tem impacto no app)
if (typeof window !== "undefined") {
  // @ts-ignore
  window.supabase = supabase;
}

