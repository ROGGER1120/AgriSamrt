import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('agrismart_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.data.success) {
            setUser(res.data.user);
          }
        } catch (err) {
          console.warn('Session expired or invalid token');
          localStorage.removeItem('agrismart_token');
          setToken(null);
          setUser(null);
        }
      } else {
        // Fallback default guest / farmer demo user
        setUser({
          _id: 'guest_farmer',
          name: 'Balwinder Singh (Kisan)',
          email: 'farmer@agrismart.in',
          role: 'farmer',
          state: 'Punjab',
          district: 'Ludhiana',
          favoriteCrops: ['Wheat', 'Basmati Rice', 'Mustard', 'Tomato'],
        });
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.data.success) {
      localStorage.setItem('agrismart_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    }
    return { success: false, message: res.data.message };
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    if (res.data.success) {
      localStorage.setItem('agrismart_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    }
    return { success: false, message: res.data.message };
  };

  const logout = () => {
    localStorage.removeItem('agrismart_token');
    setToken(null);
    setUser(null);
  };

  const toggleFavorite = async (cropName) => {
    if (!user) return;
    try {
      const isFav = user.favoriteCrops?.includes(cropName);
      const newFavs = isFav
        ? user.favoriteCrops.filter((c) => c !== cropName)
        : [...(user.favoriteCrops || []), cropName];

      setUser({ ...user, favoriteCrops: newFavs });

      if (token && user._id !== 'guest_farmer') {
        await authAPI.updateFavorites({ cropToToggle: cropName });
      }
    } catch (err) {
      console.error('Failed to update favorites:', err);
    }
  };

  // Quick switch between Farmer and Admin demo accounts for testing
  const switchDemoRole = async (targetRole) => {
    try {
      if (targetRole === 'admin') {
        await login('admin@agrismart.in', 'Admin@123');
      } else {
        await login('farmer@agrismart.in', 'Farmer@123');
      }
    } catch (err) {
      // If server login not reachable, switch local demo
      setUser({
        _id: targetRole === 'admin' ? 'demo_admin' : 'demo_farmer',
        name: targetRole === 'admin' ? 'Dr. Ramesh Patel (Admin)' : 'Balwinder Singh (Kisan)',
        email: targetRole === 'admin' ? 'admin@agrismart.in' : 'farmer@agrismart.in',
        role: targetRole,
        state: targetRole === 'admin' ? 'Maharashtra' : 'Punjab',
        favoriteCrops: targetRole === 'admin' ? ['Wheat', 'Tomato', 'Onion', 'Cotton'] : ['Wheat', 'Basmati Rice', 'Mustard'],
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        toggleFavorite,
        switchDemoRole,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
