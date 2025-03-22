
import { createClient } from '@supabase/supabase-js';

// Supabase URLs and keys (replace with your own values)
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Collection/table names as constants for consistency
export const TABLES = {
  USERS: 'users',
  REPORTS: 'reports',
};

// User roles
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

// Helper function to get user data from the authentication session
export const getUserData = async (userId: string) => {
  const { data, error } = await supabase
    .from(TABLES.USERS)
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
  
  return data;
};
