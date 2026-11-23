import { createContext, useContext, useState, useEffect } from 'react';
import { authLogin, authRegister, authMe, authLogout } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('medpredict_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('medpredict_token') || null;
  });

  const [loading, setLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('medpredict_token');
      if (storedToken) {
        try {
          const profile = await authMe();
          setUser(profile);
          localStorage.setItem('medpredict_user', JSON.stringify(profile));
        } catch (err) {
          console.warn('[Auth] Session validation failed:', err.message);
          // Only clear if 401 unauthorized
          if (err.response && err.response.status === 401) {
            setToken(null);
            setUser(null);
            localStorage.removeItem('medpredict_token');
            localStorage.removeItem('medpredict_user');
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authLogin({ email, password });
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('medpredict_token', data.access_token);
    localStorage.setItem('medpredict_user', JSON.stringify(data.user));
    return data.user;
  };

  const register = async (name, email, password) => {
    const data = await authRegister({ name, email, password });
    setToken(data.access_token);
    setUser(data.user);
    localStorage.setItem('medpredict_token', data.access_token);
    localStorage.setItem('medpredict_user', JSON.stringify(data.user));
    return data.user;
  };

  const logout = async () => {
    try {
      if (localStorage.getItem('medpredict_token')) await authLogout();
    } catch {
      // Always remove the local credential; a network failure must not trap a user in-session.
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('medpredict_token');
    localStorage.removeItem('medpredict_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
