import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('assetflow_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('assetflow_token'));
  const [loading, setLoading] = useState(true);

  const persistAuth = (authToken, authUser) => {
    if (authToken) {
      localStorage.setItem('assetflow_token', authToken);
      localStorage.setItem('assetflow_role', authUser?.role || '');
      localStorage.setItem('assetflow_user', JSON.stringify(authUser));
    }
  };

  const updateUser = (updater) => {
    setUser((current) => {
      const nextUser = typeof updater === 'function' ? updater(current) : updater;
      if (nextUser) {
        localStorage.setItem('assetflow_user', JSON.stringify(nextUser));
        localStorage.setItem('assetflow_role', nextUser.role || '');
      } else {
        localStorage.removeItem('assetflow_user');
        localStorage.removeItem('assetflow_role');
      }
      return nextUser;
    });
  };

  const logout = (showToast = true) => {
    localStorage.removeItem('assetflow_token');
    localStorage.removeItem('assetflow_user');
    localStorage.removeItem('assetflow_role');
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
          const profileUser = res?.data?.data?.user || null;
          if (profileUser) {
            updateUser(profileUser);
          }
        })
        .catch(() => {
          logout(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password, selectedRole = 'admin') => {
    const response = await api.post('/auth/login', { email, password, role: selectedRole.toUpperCase() });
    const authToken = response?.data?.data?.token;
    const authUser = response?.data?.data?.user;
    if (authToken) {
      persistAuth(authToken, authUser);
      setToken(authToken);
      updateUser(authUser);
      if (response?.data?.data?.mustChangePassword) {
        toast.info('Please change your temporary password before continuing');
      } else {
        toast.success('Welcome back to AssetFlow AI');
      }
      return response;
    }
    throw new Error('Authentication failed');
  };

  const register = async (fullName, email, password, phone, role = 'admin') => {
    const response = await api.post('/auth/register', { fullName, email, password, phone, role });
    const authToken = response?.data?.data?.token;
    const authUser = response?.data?.data?.user;
    if (authToken) {
      persistAuth(authToken, authUser);
      setToken(authToken);
      updateUser(authUser);
      toast.success('Account created successfully');
      return response;
    }
    throw new Error('Registration failed');
  };

  const value = useMemo(() => ({ user, token, loading, login, register, logout, setUser, updateUser }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context) {
    return context;
  }

  return {
    user: null,
    token: null,
    loading: false,
    login: async () => {
      throw new Error('Authentication context is not available');
    },
    register: async () => {
      throw new Error('Authentication context is not available');
    },
    logout: () => {},
    setUser: () => {},
    updateUser: () => {},
  };
}
