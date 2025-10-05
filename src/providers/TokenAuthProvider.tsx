import React, { createContext, useContext, useEffect, useState } from 'react'
import { TokenManager } from '../services/tokenManager'
import { signInWithGoogle, signOutGoogle } from '../lib/googleAuth'

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
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signInWithGoogle: async () => ({ data: null, error: null }),
  signOut: async () => {}
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      // Check if we have a valid token
      const isAuth = await TokenManager.isAuthenticated()
      
      if (isAuth) {
        // Get user data from stored token
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

  const handleSignOut = async () => {
    try {
      await signOutGoogle()
      
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
      signOut: handleSignOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
