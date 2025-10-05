import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthToken {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user_data: {
    full_name: string;
    email: string;
    avatar_url: string;
    google_id: string;
  };
}

const TOKEN_KEY = '@auth_token';
const USER_DATA_KEY = '@user_data';

export class TokenManager {
  // Store Google OAuth token and user data
  static async storeAuthToken(tokenData: AuthToken): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData));
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(tokenData.user_data));
    } catch (error) {
      console.error('Error storing auth token:', error);
    }
  }

  // Get stored auth token
  static async getAuthToken(): Promise<AuthToken | null> {
    try {
      const tokenData = await AsyncStorage.getItem(TOKEN_KEY);
      if (tokenData) {
        const parsed = JSON.parse(tokenData);
        // Check if token is expired
        if (parsed.expires_at > Date.now()) {
          return parsed;
        } else {
          await this.clearAuthToken();
          return null;
        }
      }
      return null;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  // Get stored user data
  static async getUserData(): Promise<any | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  // Clear stored auth token
  static async clearAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_DATA_KEY);
    } catch (error) {
      console.error('Error clearing auth token:', error);
    }
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    const token = await this.getAuthToken();
    return token !== null;
  }

  // Extract user data from Google OAuth URL
  static extractUserDataFromUrl(url: string): AuthToken | null {
    try {
      // Handle both hash fragment and query parameters
      let accessToken: string | null;
      let refreshToken: string | null;
      let expiresAt: string | null;
      
      if (url.includes('#')) {
        // Handle hash fragment format: photosharing://auth/callback#access_token=...
        const hashPart = url.split('#')[1];
        const params = new URLSearchParams(hashPart);
        accessToken = params.get('access_token');
        refreshToken = params.get('refresh_token');
        expiresAt = params.get('expires_at');
      } else {
        // Handle query parameter format: photosharing://auth/callback?access_token=...
        const urlObj = new URL(url);
        accessToken = urlObj.searchParams.get('access_token');
        refreshToken = urlObj.searchParams.get('refresh_token');
        expiresAt = urlObj.searchParams.get('expires_at');
      }
      
      if (!accessToken || !refreshToken || !expiresAt) {
        return null;
      }

      // Decode the access token to get user data
      const tokenParts = accessToken.split('.');
      if (tokenParts.length !== 3) {
        return null;
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      const userData = payload.user_metadata || {};
      
      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_at: parseInt(expiresAt) * 1000, // Convert to milliseconds
        user_data: {
          full_name: userData.full_name || userData.name || 'User',
          email: userData.email || payload.email || '',
          avatar_url: userData.avatar_url || userData.picture || '',
          google_id: userData.provider_id || userData.sub || '',
        }
      };
    } catch (error) {
      console.error('Error extracting user data from URL:', error);
      return null;
    }
  }
}
