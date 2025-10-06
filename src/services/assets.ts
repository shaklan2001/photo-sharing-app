import { supabase } from "../lib/superbase";
import { TablesInsert } from "../types/database.types";

export const insertAsset = async (newAsset: TablesInsert<"assets">) => {
  try {
    const { data, error } = await supabase
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
    const { data, error } = await supabase
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