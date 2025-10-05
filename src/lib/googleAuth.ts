import * as WebBrowser from 'expo-web-browser'
import * as Linking from 'expo-linking'
import { makeRedirectUri } from 'expo-auth-session'
import { supabase } from './superbase'

WebBrowser.maybeCompleteAuthSession()

export async function signInWithGoogle() {
  // Force the custom scheme instead of relying on makeRedirectUri
  const redirectTo = 'photosharing://auth/callback'

  console.log('Redirect URI:', redirectTo)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  })

  if (error) {
    console.error('Google Sign-In Error:', error)
    return { data: null, error }
  }

  console.log('Redirecting to:', data.url)
  
  if (data?.url) {
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo)
    
    if (result.type === 'success') {
      console.log('Auth session successful:', result.url)
      return { data: { success: true }, error: null }
    } else if (result.type === 'cancel') {
      console.log('Auth session cancelled')
      return { data: null, error: new Error('Authentication cancelled') }
    } else {
      console.log('Auth session failed:', result.type)
      return { data: null, error: new Error('Authentication failed') }
    }
  }

  return { data: null, error: new Error('No redirect URL received') }
}

export async function signOutGoogle() {
  try {
    await supabase.auth.signOut()
  } catch (error) {
    console.error('Google Sign-Out Error:', error)
  }
}
