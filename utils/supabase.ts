import "https://deno.land/std@0.179.0/dotenv/load.ts";
import { createClient } from "supabase";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!,
  SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_KEY")!,
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export { supabase };
