import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/database.types";

const API_URL = import.meta.env.VITE_API_URL_EXAFAM_FIXTURE;
const API_KEY = import.meta.env.VITE_API_FIXTURE_ANON_KEY;

if (!API_URL || !API_KEY) {
  throw new Error(
    "Las variables de entorno API_URL_EXAFAM_FIXTURE y API_FIXTURE_ANON_KEY deben estar definidas",
  );
}

export const clientApi = createClient<Database>(API_URL, API_KEY);
