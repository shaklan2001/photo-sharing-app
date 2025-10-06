import { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/superbase'
import { signInWithGoogle as googleSignIn } from '../lib/googleAuth'
import { logger } from '../utils/logger'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  loginType: 'google' | 'email' | null
  signInWithGoogle: () => Promise<{ error?: any; success?: boolean }>
  signInWithEmail: (email: string, password: string) => Promise<{ error?: any }>
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error?: any }>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  loginType: null,
  signInWithGoogle: async () => ({}),
  signInWithEmail: async () => ({}),
  signUpWithEmail: async () => ({}),
  signOut: async () => {}
})

const USER_SESSION_KEY = '@user_session'

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loginType, setLoginType] = useState<'google' | 'email' | null>(null)

  useEffect(() => {
    initializeAuth()
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        logger.log('Auth state changed:', event, !!session)
        
        if (session?.user) {
          setUser(session.user)
          setIsAuthenticated(true)
          
          // Determine login type based on user metadata
          const provider = session.user.app_metadata?.provider
          const loginTypeValue = provider === 'google' ? 'google' : 'email'
          setLoginType(loginTypeValue)
          
          logger.log('User session:', { 
            userId: session.user.id, 
            email: session.user.email,
            provider,
            loginType: loginTypeValue 
          })
          
          // Store session data for future app launches
          await storeUserSession({
            user: session.user,
            loginType: loginTypeValue
          })
        } else {
          setUser(null)
          setIsAuthenticated(false)
          setLoginType(null)
          await clearUserSession()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const initializeAuth = async () => {
    try {
      setIsLoading(true)
      
      // Check if user is already signed in with Supabase
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error && error.message !== 'Auth session missing!') {
        logger.error('Error getting session:', error)
      }
      
      if (session?.user) {
        // User is already authenticated
        const provider = session.user.app_metadata?.provider
        const loginTypeValue = provider === 'google' ? 'google' : 'email'
        
        setUser(session.user)
        setIsAuthenticated(true)
        setLoginType(loginTypeValue)
        
        logger.log('Existing session found:', { 
          userId: session.user.id, 
          email: session.user.email,
          provider,
          loginType: loginTypeValue 
        })
        
        // Store session data for consistency
        await storeUserSession({
          user: session.user,
          loginType: loginTypeValue
        })
      } else {
        // No session, user needs to sign in
        logger.log('No existing session found')
      }
    } catch (error) {
      logger.error('Error initializing auth:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const storeUserSession = async (sessionData: {
    user: User
    loginType: 'google' | 'email'
  }) => {
    try {
      await AsyncStorage.setItem(USER_SESSION_KEY, JSON.stringify({
        userId: sessionData.user.id,
        loginType: sessionData.loginType,
        email: sessionData.user.email,
        createdAt: Date.now()
      }))
    } catch (error) {
      logger.error('Error storing user session:', error)
    }
  }

  const clearUserSession = async () => {
    try {
      await AsyncStorage.removeItem(USER_SESSION_KEY)
    } catch (error) {
      logger.error('Error clearing user session:', error)
    }
  }

  const signInWithGoogle = async () => {
    try {
      const result = await googleSignIn()
      
      if (result.success) {
        logger.log('Google sign-in completed successfully')
        // The session should already be set by the googleSignIn function
        // The auth state change listener will handle updating the UI
      }
      
      return result
    } catch (error) {
      logger.error('Google sign-in error:', error)
      return { error }
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        logger.error('Email sign-in error:', error)
        return { error }
      }

      logger.log('Email sign-in successful')
      return { error: null }
    } catch (error) {
      logger.error('Email sign-in error:', error)
      return { error }
    }
  }

  const signUpWithEmail = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })

      if (error) {
        logger.error('Email sign-up error:', error)
        return { error }
      }

      logger.log('Email sign-up successful')
      return { error: null }
    } catch (error) {
      logger.error('Email sign-up error:', error)
      return { error }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      await clearUserSession()
    } catch (error) {
      logger.error('Sign out error:', error)
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        isLoading,
        loginType,
        signInWithGoogle, 
        signInWithEmail,
        signUpWithEmail,
        signOut 
      }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}