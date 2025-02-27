import { createContext, useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login as loginRequest } from "../core/requests";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const loginMutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      const userData = { token: data.token };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    },
    onError: (error) => {
      console.error("Erro no login:", error);
    },
  });

  const login = async (credentials) => {
    try {
      await loginMutation.mutateAsync(credentials);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const getUserId = () => {
    if (user && user.token) {
      try {
        const decoded = jwtDecode(user.token);
        return decoded.id || decoded.userId;
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
      }
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, getUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
