
import { supabase } from "../lib/superbase";
import { TablesInsert } from "../types/database.types";

export const insertAsset = async (newAsset: TablesInsert<"assets">) => {
  const { data } = await supabase.from("assets").insert(newAsset)
    .select().single().throwOnError();
  return data;
};

export const getAssetsForEvent = async (eventId: string) => {
  const { data } = await supabase.from("assets").select("*, profiles(*)").eq(
    "event_id",
    eventId,
  ).throwOnError();
  return data;
};