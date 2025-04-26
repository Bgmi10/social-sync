import React, { createContext, useContext, useEffect, useState } from "react";
import { baseUrl } from "../utils/constants";

type AuthContextType = {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await fetch(baseUrl + "/profile", {
        method: "GET",
        credentials: "include"   
      });
      
      if (res.status === 200) {
        const data = await res.json();
        setUser(data.data.user);
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error("Authentication check failed:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};