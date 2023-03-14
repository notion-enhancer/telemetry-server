import "https://deno.land/std@0.179.0/dotenv/load.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!,
  SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!,
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const supportedPlatforms = [
  "aix",
  "darwin",
  "freebsd",
  "linux",
  "openbsd",
  "sunos",
  "win32",
  "firefox",
  "chromium",
];

export { supabase, supportedPlatforms };
