import { User } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/superbase'
import { signInWithGoogle, signOutGoogle } from '../lib/googleAuth'

type AuthContextType = {
    user: User | null
    isAuthenticated: boolean
    signInWithGoogle: () => Promise<{ data: any; error: any }>
    signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    signInWithGoogle: async () => ({ data: null, error: null }),
    signOut: async () => {}
}) 

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(()=> {
    const signInEvents = async () => {
      const {data, error} = await supabase?.auth?.getSession();

      if(data.session) {
        setUser(data.session.user)
        setIsAuthenticated(true)
      }
      
      if(error) {
        return;
      }
      
      if(!data.session) {
        const {data: signInData, error: signInError} = await supabase.auth.signInAnonymously();
        if(signInError) {
          console.log(signInError)
        }
        if(signInData) {
          setUser(signInData?.user)
          setIsAuthenticated(true)
        }
      }
    }
    signInEvents();
  },[])

  // Listen for auth state changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        console.log('User signed in:', session.user)
        setUser(session.user)
        setIsAuthenticated(true)
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }
    })

    return () => authListener.subscription.unsubscribe()
  }, [])

  const handleGoogleSignIn = async () => {
    return await signInWithGoogle();
  };

  const handleSignOut = async () => {
    await signOutGoogle();
    setUser(null);
    setIsAuthenticated(false);
  };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated, 
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
  
