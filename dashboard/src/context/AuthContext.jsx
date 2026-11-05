import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api, { getStoredToken, setStoredToken, clearStoredToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Checks token and loads user profile
  const fetchCurrentUser = useCallback(async () => {
    const existingToken = getStoredToken();
    if (!existingToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      const data = await api.getMe();
      if (data && data.user) {
        setUser(data.user);
        setToken(existingToken);
      } else {
        clearStoredToken();
        setUser(null);
        setToken(null);
      }
    } catch {
      clearStoredToken();
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    if (data.token) {
      setStoredToken(data.token);
      setToken(data.token);
    }
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password, track) => {
    const data = await api.register({ name, email, password, track });
    if (data.token) {
      setStoredToken(data.token);
      setToken(data.token);
    }
    setUser(data.user);
    return data;
  };

  const logout = () => {
    clearStoredToken();
    setUser(null);
    setToken(null);
  };

  const updateUserTrack = async (newTrack) => {
    try {
      const res = await api.updateTrack(newTrack);
      if (res?.user) {
        setUser((prev) => (prev ? { ...prev, track: res.user.track } : res.user));
      }
    } catch (err) {
      console.warn('Failed to update track on backend:', err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn: !!user,
        loading,
        login,
        register,
        logout,
        updateUserTrack,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
