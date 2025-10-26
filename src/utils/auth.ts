// Authentication utilities for localStorage management

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  employeeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthData {
  user: User;
  token: string;
}

const AUTH_KEY = 'leaves_auth_data';

// Store authentication data in localStorage
export const setAuthData = (authData: AuthData): void => {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
  } catch (error) {
    console.error('Failed to store auth data:', error);
  }
};

// Get authentication data from localStorage
export const getAuthData = (): AuthData | null => {
  try {
    const authData = localStorage.getItem(AUTH_KEY);
    if (authData) {
      return JSON.parse(authData);
    }
    return null;
  } catch (error) {
    console.error('Failed to retrieve auth data:', error);
    return null;
  }
};

// Get the stored token
export const getToken = (): string | null => {
  const authData = getAuthData();
  return authData?.token || null;
};

// Get the stored user
export const getUser = (): User | null => {
  const authData = getAuthData();
  return authData?.user || null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const authData = getAuthData();
  return !!(authData?.token && authData?.user);
};

// Clear authentication data
export const clearAuthData = (): void => {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch (error) {
    console.error('Failed to clear auth data:', error);
  }
};

// Check if token is expired (basic check - you might want to decode JWT for more accuracy)
export const isTokenExpired = (): boolean => {
  const token = getToken();
  if (!token) return true;
  
  try {
    // Basic JWT expiration check
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Failed to check token expiration:', error);
    return true;
  }
};

// Get authorization header for API requests
export const getAuthHeader = (): { Authorization: string } | {} => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
