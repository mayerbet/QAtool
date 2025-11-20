// src/utils/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kqsgnqtirzrxiklnnkmv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtxc2ducXRpcnpyeGlrbG5ua212Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NjAyNTEsImV4cCI6MjA2NzEzNjI1MX0.-_SBOynxsOfA_9SCd8eKHMesqw1vl8lFd868mqlpNc0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
