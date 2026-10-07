import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'PLACEHOLDER_URL';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'PLACEHOLDER_KEY';
export const supabase = createClient(supabaseUrl, supabaseKey);
