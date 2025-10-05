import React, { createContext, useContext, useEffect, useState } from 'react'
import { TokenManager } from '../services/tokenManager'
import { signInWithGoogle, signOutGoogle } from '../lib/googleAuth'
import { supabase } from '../lib/superbase'

interface UserData {
  full_name: string;
  email: string;
  avatar_url: string;
  google_id: string;
}

type AuthContextType = {
  user: UserData | null
  isAuthenticated: boolean
  isLoading: boolean
  signInWithGoogle: () => Promise<{ data: any; error: any }>
  signInAnonymously: () => Promise<{ data: any; error: any }>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signInWithGoogle: async () => ({ data: null, error: null }),
  signInAnonymously: async () => ({ data: null, error: null }),
  signOut: async () => {}
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const userData = {
          full_name: session.user.user_metadata?.full_name || 'Guest User',
          email: session.user.email || '',
          avatar_url: session.user.user_metadata?.avatar_url || '',
          google_id: session.user.id
        }
        
        setUser(userData)
        setIsAuthenticated(true)
        
        // Store in TokenManager for consistency
        const authToken = {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: session.expires_at * 1000,
          user_data: userData
        }
        await TokenManager.storeAuthToken(authToken)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setIsAuthenticated(false)
        await TokenManager.clearAuthToken()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAuthStatus = async () => {
    try {
      // Check Supabase session first
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error getting session:', error)
        setIsAuthenticated(false)
        return
      }

      if (session?.user) {
        // Convert Supabase user to our UserData format
        const userData = {
          full_name: session.user.user_metadata?.full_name || 'Guest User',
          email: session.user.email || '',
          avatar_url: session.user.user_metadata?.avatar_url || '',
          google_id: session.user.id
        }
        
        setUser(userData)
        setIsAuthenticated(true)
        
        // Also store in TokenManager for consistency
        const authToken = {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: session.expires_at * 1000,
          user_data: userData
        }
        await TokenManager.storeAuthToken(authToken)
      } else {
        // Check if we have a valid token in storage as fallback
        const isAuth = await TokenManager.isAuthenticated()
        
        if (isAuth) {
          const userData = await TokenManager.getUserData()
          if (userData) {
            setUser(userData)
            setIsAuthenticated(true)
          } else {
            setIsAuthenticated(false)
          }
        } else {
          setIsAuthenticated(false)
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle()
      
      if (result.data?.success) {
        // Refresh auth status
        await checkAuthStatus()
        return result
      } else {
        return result
      }
    } catch (error) {
      console.error('Google sign-in error:', error)
      return { data: null, error }
    }
  }

  const handleAnonymousSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInAnonymously()
      
      if (error) {
        console.error('Anonymous sign-in error:', error)
        return { data: null, error }
      }

      if (data?.user) {
        // Store user data in TokenManager format for consistency
        const userData = {
          full_name: 'Guest User',
          email: '',
          avatar_url: '',
          google_id: data.user.id
        }

        const authToken = {
          access_token: data.session?.access_token || '',
          refresh_token: data.session?.refresh_token || '',
          expires_at: data.session?.expires_at ? data.session.expires_at * 1000 : Date.now() + (30 * 24 * 60 * 60 * 1000),
          user_data: userData
        }

        await TokenManager.storeAuthToken(authToken)
        
        // Refresh auth status
        await checkAuthStatus()
        return { data: { success: true }, error: null }
      } else {
        return { data: null, error: new Error('No user data returned') }
      }
    } catch (error) {
      console.error('Anonymous sign-in error:', error)
      return { data: null, error }
    }
  }

  const handleSignOut = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut()
      
      // Clear local tokens
      await TokenManager.clearAuthToken()
      
      // Clear local state
      setUser(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading,
      signInWithGoogle: handleGoogleSignIn,
      signInAnonymously: handleAnonymousSignIn,
      signOut: handleSignOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
