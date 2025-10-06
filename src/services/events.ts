import { supabase } from "../lib/superbase";
import { TablesInsert } from "../types/database.types";

export async function getEvents() {
  try {
    const { data } = await supabase.from("events").select("*");
    return data || [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

export async function getEventsForUser(userId: string) {
  try {
    const { data } = await supabase.from("event_memberships").select(
      "*, events(*, event_memberships(count))",
    ).eq("user_id", userId);
    
    if (!data) return [];
    return data.map((event_membership) => event_membership.events);
  } catch (error) {
    console.error('Error fetching events for user:', error);
    return [];
  }
}

export async function getEvent(id: string) {
  try {
    const { data } = await supabase.from("events").select("*, assets(*)").eq("id", id).single();
    return data;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

export async function createEvent(
  newEvent: TablesInsert<"events">,
  userId: string,
) {
  try {
    // Insert the event
    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .insert(newEvent)
      .select()
      .single();

    if (eventError) {
      throw eventError;
    }

    // Add user as a member of the event
    const { error: membershipError } = await supabase
      .from("event_memberships")
      .insert({
        event_id: eventData.id,
        user_id: userId,
      });

    if (membershipError) {
      console.error('Error creating event membership:', membershipError);
      // Don't throw here as the event was created successfully
    }

    return eventData;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
}

export async function joinEvent(eventId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from("event_memberships")
      .insert({
        event_id: eventId,
        user_id: userId,
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error joining event:', error);
    throw error;
  }
}