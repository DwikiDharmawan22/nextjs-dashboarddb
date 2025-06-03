'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type AuthContextType = {
  isLoggedIn: boolean;
  login: (token: string) => void; // Menambahkan parameter token untuk login
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Menambahkan state untuk menangani loading

  // Inisialisasi status autentikasi saat komponen dimuat
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsLoggedIn(true); // Set isLoggedIn ke true jika token ada
    }
    setIsLoading(false); // Tandai bahwa inisialisasi selesai
  }, []);

  const login = (token: string) => {
    localStorage.setItem('authToken', token); // Simpan token di localStorage
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken'); // Hapus token dari localStorage
    setIsLoggedIn(false);
  };

  // Jangan render anak sampai inisialisasi selesai
  if (isLoading) {
    return null; // Atau bisa diganti dengan loading spinner
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
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