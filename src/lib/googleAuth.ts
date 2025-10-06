import * as WebBrowser from 'expo-web-browser'
import { makeRedirectUri } from 'expo-auth-session'
import { supabase } from './superbase'
import { logger } from '../utils/logger'

WebBrowser.maybeCompleteAuthSession()

export async function signInWithGoogle() {
  try {
    const redirectTo = makeRedirectUri({
      scheme: 'photosharing',
      path: 'auth/callback',
    })

    logger.log('Redirect URI:', redirectTo)
    
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
      logger.error('Google Sign-In Error:', error)
      return { error }
    }

    if (data?.url) {
      logger.log('Opening auth session with URL:', data.url)
      
      const result = await WebBrowser.openAuthSessionAsync(
        data.url, 
        redirectTo,
        {
          showInRecents: true,
          preferEphemeralSession: false,
        }
      )
      
      logger.log('Auth session result:', result)
      
      if (result.type === 'success') {
        logger.log('Google sign-in successful')
        logger.log('Callback URL received:', result.url)
        
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
            logger.log('Hash fragment:', hashPart)
            
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

          logger.log('Extracted tokens:', {
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
            hasError: !!error
          })

          if (error) {
            logger.error('OAuth error:', error)
            return { error: new Error(error) }
          }

          if (accessToken && refreshToken) {
            logger.log('Setting session with tokens...')
            
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            })
            
            if (sessionError) {
              logger.error('Session set error:', sessionError)
              return { error: sessionError }
            }

            logger.log('Session set successfully:', !!sessionData.session)
            return { error: null, success: true }
          } else {
            logger.log('Missing tokens in callback URL')
            return { error: new Error('Missing authentication tokens') }
          }
        } catch (parseError) {
          logger.error('Error parsing callback URL:', parseError)
          return { error: parseError }
        }
      } else if (result.type === 'cancel') {
        logger.log('Google sign-in cancelled by user')
        return { error: new Error('Authentication cancelled') }
      } else {
        logger.log('Google sign-in failed:', result)
        return { error: new Error('Authentication failed') }
      }
    }

    return { error: new Error('No redirect URL received') }
  } catch (error) {
    logger.error('Google Sign-In Error:', error)
    return { error }
  }
}

export async function signOutGoogle() {
  try {
    await supabase.auth.signOut()
  } catch (error) {
    logger.error('Google Sign-Out Error:', error)
  }
}