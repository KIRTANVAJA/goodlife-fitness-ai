import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import storageService from '../services/storageService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('glf_auth_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('glf_auth_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.success && res.user) {
            setUser(res.user);
            // Cache non-sensitive UI display data safely scoped to user ID
            storageService.setUserItem(res.user.id, 'display-profile', {
              name: res.user.name,
              fitnessLevel: res.user.profile?.fitnessLevel,
              tier: res.user.subscription?.tier || 'free',
            });
          } else {
            logout();
          }
        } catch (err) {
          console.warn('[Auth] Session validation failed:', err.message);
          // If offline, user state can't be authoritatively verified against MongoDB
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success && res.token) {
        // Clear previous user cached data if another user logged in on this browser
        if (user && user.id !== res.user.id) {
          storageService.clearUserData(user.id);
        }

        localStorage.setItem('glf_auth_token', res.token);
        setToken(res.token);
        setUser(res.user);

        // Store non-sensitive UI cache
        storageService.setUserItem(res.user.id, 'display-profile', {
          name: res.user.name,
          fitnessLevel: res.user.profile?.fitnessLevel,
          tier: res.user.subscription?.tier || 'free',
        });

        return { success: true, user: res.user };
      }
      throw new Error(res.message || 'Login failed');
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const register = async (name, email, password, profile = {}) => {
    setError(null);
    try {
      const res = await api.post('/auth/register', { name, email, password, profile });
      if (res.success && res.token) {
        localStorage.setItem('glf_auth_token', res.token);
        setToken(res.token);
        setUser(res.user);
        return { success: true, user: res.user };
      }
      throw new Error(res.message || 'Registration failed');
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    if (user?.id) {
      // Purge all user-scoped cached records to prevent cross-account data leakage
      storageService.clearUserData(user.id);
    }
    localStorage.removeItem('glf_auth_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', { profile: profileData });
      if (res.success && res.user) {
        setUser(res.user);
        storageService.setUserItem(res.user.id, 'display-profile', {
          name: res.user.name,
          fitnessLevel: res.user.profile?.fitnessLevel,
          tier: res.user.subscription?.tier || 'free',
        });
        return { success: true, user: res.user };
      }
      throw new Error(res.message || 'Profile update failed');
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateSubscription = async (tier) => {
    try {
      const res = await api.put('/auth/subscription', { tier });
      if (res.success && res.user) {
        setUser(res.user);
        storageService.setUserItem(res.user.id, 'display-profile', {
          name: res.user.name,
          fitnessLevel: res.user.profile?.fitnessLevel,
          tier: res.user.subscription?.tier,
        });
        return { success: true, user: res.user };
      }
      throw new Error(res.message || 'Subscription update failed');
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const upgradeToPremium = async () => {
    try {
      const res = await api.post('/auth/subscription/upgrade', {});
      if (res.success && res.user) {
        setUser(res.user);
        storageService.setUserItem(res.user.id, 'display-profile', {
          name: res.user.name,
          fitnessLevel: res.user.profile?.fitnessLevel,
          tier: 'gold',
        });
        return { success: true, user: res.user };
      }
      throw new Error(res.message || 'Upgrade failed');
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const cancelSubscription = async () => {
    try {
      const res = await api.post('/auth/subscription/cancel', {});
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true, user: res.user };
      }
      throw new Error(res.message || 'Cancellation failed');
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Free AI Coach Architecture: all athletes have full access to optical pose tracking and AI features
  const isPremium = true;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isPremium,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        updateSubscription,
        upgradeToPremium,
        cancelSubscription,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
