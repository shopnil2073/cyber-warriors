import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://rzhqvbqddckknhljuidf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6aHF2YnFkZGNra25obGp1aWRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNjE4MDcsImV4cCI6MjEwNTgzNzgwN30.D2ID73ej58yg7rjouE4EkCOvlHLz-M8bN2M9VduN8BQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);