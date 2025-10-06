import * as WebBrowser from 'expo-web-browser'
import { makeRedirectUri } from 'expo-auth-session'
import { supabase } from './superbase'

WebBrowser.maybeCompleteAuthSession()

export async function signInWithGoogle() {
  try {
    const redirectTo = makeRedirectUri({
      scheme: 'photosharing',
      path: 'auth/callback',
    })

    console.log('Redirect URI:', redirectTo)
    
    // Ensure WebBrowser session is properly completed
    WebBrowser.maybeCompleteAuthSession()

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
      return { error }
    }

    if (data?.url) {
      console.log('Opening auth session with URL:', data.url)
      
      const result = await WebBrowser.openAuthSessionAsync(
        data.url, 
        redirectTo,
        {
          showInRecents: true,
          preferEphemeralSession: false,
        }
      )
      
      console.log('Auth session result:', result)
      
      if (result.type === 'success') {
        console.log('Google sign-in successful')
        console.log('Callback URL received:', result.url)
        
        // Process the tokens directly here instead of relying on the callback route
        try {
          const callbackUrl = result.url
          
          // Parse the URL to extract tokens
          let accessToken: string | null = null
          let refreshToken: string | null = null
          let error: string | null = null

          // Handle hash fragment format (most common for OAuth)
          if (callbackUrl.includes('#')) {
            const hashPart = callbackUrl.split('#')[1]
            console.log('Hash fragment:', hashPart)
            
            const params = new URLSearchParams(hashPart)
            accessToken = params.get('access_token')
            refreshToken = params.get('refresh_token')
            error = params.get('error')
          } else if (callbackUrl.includes('?')) {
            // Query parameter format
            const urlObj = new URL(callbackUrl)
            accessToken = urlObj.searchParams.get('access_token')
            refreshToken = urlObj.searchParams.get('refresh_token')
            error = urlObj.searchParams.get('error')
          }

          // Fallback: regex extraction from raw URL
          if (!accessToken && !error) {
            const tokenMatch = callbackUrl.match(/access_token=([^&]+)/)
            const refreshMatch = callbackUrl.match(/refresh_token=([^&]+)/)
            const errorMatch = callbackUrl.match(/error=([^&]+)/)
            
            if (tokenMatch) accessToken = decodeURIComponent(tokenMatch[1])
            if (refreshMatch) refreshToken = decodeURIComponent(refreshMatch[1])
            if (errorMatch) error = decodeURIComponent(errorMatch[1])
          }

          console.log('Extracted tokens:', {
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
            hasError: !!error
          })

          if (error) {
            console.error('OAuth error:', error)
            return { error: new Error(error) }
          }

          if (accessToken && refreshToken) {
            console.log('Setting session with tokens...')
            
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            })
            
            if (sessionError) {
              console.error('Session set error:', sessionError)
              return { error: sessionError }
            }

            console.log('Session set successfully:', !!sessionData.session)
            return { error: null, success: true }
          } else {
            console.log('Missing tokens in callback URL')
            return { error: new Error('Missing authentication tokens') }
          }
        } catch (parseError) {
          console.error('Error parsing callback URL:', parseError)
          return { error: parseError }
        }
      } else if (result.type === 'cancel') {
        console.log('Google sign-in cancelled by user')
        return { error: new Error('Authentication cancelled') }
      } else {
        console.log('Google sign-in failed:', result)
        return { error: new Error('Authentication failed') }
      }
    }

    return { error: new Error('No redirect URL received') }
  } catch (error) {
    console.error('Google Sign-In Error:', error)
    return { error }
  }
}

export async function signOutGoogle() {
  try {
    await supabase.auth.signOut()
  } catch (error) {
    console.error('Google Sign-Out Error:', error)
  }
}