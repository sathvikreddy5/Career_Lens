import { createContext, useContext, useState } from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("careershield_user");

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem("careershield_user");

      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // =====================================================
  // LOGIN
  // =====================================================

  const login = async (email, password) => {
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("careershield_token", token);

      localStorage.setItem("careershield_user", JSON.stringify(user));

      setUser(user);

      return {
        success: true,
        user,
      };
    } catch (error) {
      console.error("Login error:", error);

      return {
        success: false,

        message:
          error.response?.data?.message ||
          "Unable to sign in. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // REGISTER
  // =====================================================

  const register = async (name, email, password) => {
    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      return {
        success: true,

        message: response.data?.message || "Account created successfully.",
      };
    } catch (error) {
      console.error("Registration error:", error);

      return {
        success: false,

        message:
          error.response?.data?.message ||
          "Unable to create account. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {
    localStorage.removeItem("careershield_token");

    localStorage.removeItem("careershield_user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// =====================================================
// useAuth
// =====================================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
