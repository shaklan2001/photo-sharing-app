import * as WebBrowser from 'expo-web-browser'
import { makeRedirectUri } from 'expo-auth-session'
import { supabase } from './superbase'
import { TokenManager } from '../services/tokenManager'

WebBrowser.maybeCompleteAuthSession()

export async function signInWithGoogle() {
  const redirectTo = makeRedirectUri({
    scheme: 'photosharing',
    path: 'auth/callback',
  })

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { 
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })

  if (error) {
    console.error('Google Sign-In Error:', error)
    return { data: null, error }
  }

  if (data?.url) {
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo)
    if (result.type === 'success') {
      // Extract user data from the OAuth URL
      const tokenData = TokenManager.extractUserDataFromUrl(result.url)
      if (tokenData) {
        // Store the token and user data
        await TokenManager.storeAuthToken(tokenData)
        
        // Also create profile in database
        const { upsertUserProfile } = await import('../services/profile')
        
        const userId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
        
        const { data: profileResult, error: profileError } = await upsertUserProfile(
          userId, // Use generated UUID as user ID
          {
            full_name: tokenData.user_data.full_name,
            avatar_url: tokenData.user_data.avatar_url,
            username: tokenData.user_data.full_name.toLowerCase().replace(/\s+/g, '_'),
            google_id: tokenData.user_data.google_id, // Store Google ID separately
            email: tokenData.user_data.email,
          }
        )
        
        if (profileError) {
          console.error('Error creating profile:', profileError)
        }
        
        return { data: { success: true, userData: tokenData.user_data }, error: null }
      } else {
        return { data: null, error: new Error('Failed to extract user data') }
      }
    } else if (result.type === 'cancel') {
      return { data: null, error: new Error('Authentication cancelled') }
    } else {
      return { data: null, error: new Error('Authentication failed') }
    }
  }

  return { data: null, error: new Error('No redirect URL received') }
}


export async function signOutGoogle() {
  try {
    await TokenManager.clearAuthToken()
    await supabase.auth.signOut()
  } catch (error) {
    console.error('Google Sign-Out Error:', error)
  }
}
