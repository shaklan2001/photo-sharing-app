import { useEffect } from 'react'
import { View, Text } from 'react-native'
import { useRouter } from 'expo-router'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    // This route is mainly for the redirect URI, but the actual processing
    // is now handled in the Google Auth function directly
    console.log('Auth callback route accessed - redirecting to events')
    
    // Give a small delay to ensure any auth state changes are processed
    const timer = setTimeout(() => {
      router.replace('/events')
    }, 1000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#ffffff',
      padding: 20 
    }}>
      <View style={{
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fdbf7b',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
      }}>
        <Text style={{ color: '#333', fontSize: 24, fontWeight: 'bold' }}>✓</Text>
      </View>
      <Text style={{ 
        color: '#333', 
        fontSize: 18, 
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center'
      }}>
        Sign In Complete
      </Text>
      <Text style={{ 
        color: '#666', 
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20
      }}>
        Taking you to your events...
      </Text>
    </View>
  )
}