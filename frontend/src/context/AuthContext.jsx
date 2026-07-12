import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('assetflow_token'));
  const [loading, setLoading] = useState(true);

  const logout = (showToast = true) => {
    localStorage.removeItem('assetflow_token');
    setToken(null);
    setUser(null);
    if (showToast) toast.info('You have been logged out');
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('assetflow_token');
    if (savedToken) {
      setToken(savedToken);
      api.get('/auth/profile')
        .then((res) => {
          setUser(res?.data?.data?.user || null);
        })
        .catch(() => {
          logout(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const authToken = response?.data?.data?.token;
    const authUser = response?.data?.data?.user;
    if (authToken) {
      localStorage.setItem('assetflow_token', authToken);
      setToken(authToken);
      setUser(authUser);
      toast.success('Welcome back to AssetFlow AI');
      return response;
    }
    throw new Error('Authentication failed');
  };

  const register = async (fullName, email, password, phone, role = 'admin') => {
    const response = await api.post('/auth/register', { fullName, email, password, phone, role });
    const authToken = response?.data?.data?.token;
    const authUser = response?.data?.data?.user;
    if (authToken) {
      localStorage.setItem('assetflow_token', authToken);
      setToken(authToken);
      setUser(authUser);
      toast.success('Account created successfully');
      return response;
    }
    throw new Error('Registration failed');
  };

  const value = useMemo(() => ({ user, token, loading, login, register, logout, setUser }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
