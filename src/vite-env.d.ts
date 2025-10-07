// This file is used to provide type definitions for Vite's `import.meta.env`
// The original reference to 'vite/client' was causing an error, so it has been replaced
// with explicit type definitions for the environment variables used in the project.

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  // Add other environment variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
