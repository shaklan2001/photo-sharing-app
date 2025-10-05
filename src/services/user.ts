import { supabase } from "../lib/superbase";
import { getUserProfile } from "./profile";

export async function getUserInfo() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  console.log('User Info:', data.user);
  console.log('User metadata:', data.user?.user_metadata);
  console.log('User identities:', data.user?.identities);
  
  // If user is authenticated, try to get their profile from database
  if (data.user && !data.user.is_anonymous) {
    const { data: profileData } = await getUserProfile(data.user.id);
    if (profileData) {
      console.log('Profile data from database:', profileData);
      // Merge profile data with user data
      return {
        ...data.user,
        profile: profileData
      };
    }
  }
  
  return data.user;
}

export async function refreshUserSession() {
  const { data, error } = await supabase.auth.refreshSession();
  
  if (error) {
    console.error('Error refreshing session:', error);
    return null;
  }
  
  console.log('Refreshed session:', data.session);
  return data.session?.user;
}
