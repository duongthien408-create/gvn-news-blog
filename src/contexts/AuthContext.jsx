import { createContext, useContext, useState, useEffect } from 'react';
import {
  loginWithUsername,
  getMe,
  logout as apiLogout,
  getStoredToken,
  clearStoredTokens,
  isTokenExpired,
} from '../lib/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getStoredToken();
      if (token && !isTokenExpired()) {
        try {
          const userData = await getMe();
          setUser(userData);
        } catch {
          clearStoredTokens();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (username, password) => {
    await loginWithUsername(username, password);
    const userData = await getMe();
    setUser(userData);
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
