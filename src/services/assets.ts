
import { supabase } from "../lib/superbase";
import { TablesInsert } from "../types/database.types";
import { TokenManager } from "./tokenManager";

// Helper function to get authenticated Supabase client
async function getAuthenticatedSupabase() {
  const token = await TokenManager.getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  // Create a new client instance with the custom token
  const { createClient } = await import('@supabase/supabase-js');
  const { Database } = await import('../types/database.types');
  
  return createClient<Database>(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      },
    }
  );
}

export const insertAsset = async (newAsset: TablesInsert<"assets">) => {
  try {
    const client = await getAuthenticatedSupabase();
    const { data, error } = await client
      .from("assets")
      .insert(newAsset)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error inserting asset:', error);
    throw error;
  }
};

export const getAssetsForEvent = async (eventId: string) => {
  try {
    const client = await getAuthenticatedSupabase();
    const { data, error } = await client
      .from("assets")
      .select("*, profiles(*)")
      .eq("event_id", eventId);
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching assets for event:', error);
    return [];
  }
};