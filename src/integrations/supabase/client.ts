import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://bioracclqflukclophsb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpb3JhY2NscWZsdWtjbG9waHNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NjI3MjcsImV4cCI6MjA3NDIzODcyN30.MqxV0qVjOa-3hlUavipOAgDpswrg2px8jpDJdCr2s24";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);