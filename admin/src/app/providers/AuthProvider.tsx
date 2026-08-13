import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

interface User {
  id: string;

  uuid?: string;

  displayName?: string | null;

  email?: string | null;
  mobile?: string | null;

  profilePhoto?: string | null;

  companyId?: string | null;

  userType?: string | null;

  status?: string | null;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  login: (token: string) => void;

  setCurrentUser: (
    user: User,
  ) => void;

  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType | null>(null);

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({
  children,
}: Props) => {
  const [accessToken, setAccessToken] =
    useState<string | null>(() =>
      localStorage.getItem("accessToken"),
    );

  const [user, setUser] =
    useState<User | null>(() => {
      const user =
        localStorage.getItem("user");

      if (!user) return null;

      try {
        return JSON.parse(user);
      } catch {
        localStorage.removeItem("user");
        return null;
      }
    });

  const login = (
    token: string,
  ) => {
    localStorage.setItem(
      "accessToken",
      token,
    );

    setAccessToken(token);
  };

  const setCurrentUser = (
    user: User,
  ) => {
    localStorage.setItem(
      "user",
      JSON.stringify(user),
    );

    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem(
      "accessToken",
    );

    localStorage.removeItem(
      "refreshToken",
    );

    localStorage.removeItem("user");

    setAccessToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isAuthenticated:
        !!accessToken,

      login,

      setCurrentUser,

      logout,
    }),
    [user, accessToken],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
};