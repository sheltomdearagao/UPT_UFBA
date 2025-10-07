// FIX: The reference to "vite/client" was causing an error, likely due to a misconfigured tsconfig.
// Adding a global declaration for ImportMeta fixes the type errors for import.meta.env.
declare global {
  interface ImportMeta {
    readonly env: {
      readonly VITE_SUPABASE_URL: string;
      readonly VITE_SUPABASE_ANON_KEY: string;
    };
  }
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key are required. Make sure they are set in your environment variables (e.g., in a .env file).");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
