import { User } from '@supabase/supabase-js'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/superbase'

type AuthContextType = {
    user: User | null
    isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false
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

    return (
        <AuthContext.Provider value={{ user, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}
  
