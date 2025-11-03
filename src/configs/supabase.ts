import { createClient } from "@supabase/supabase-js";
import { env } from "./env.ts";

// Supabase 연결
export const supabase = createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!);
