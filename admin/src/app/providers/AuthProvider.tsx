import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import type {
  UserProfile,
} from "@/modules/profile/types/profile.types";


interface AuthContextType {
  user:
    UserProfile | null;

  accessToken:
    string | null;

  isAuthenticated:
    boolean;

  login: (
    token: string,
  ) => void;

  setCurrentUser: (
    user: UserProfile,
  ) => void;

  logout: () => void;
}


const AuthContext =
  createContext<AuthContextType | null>(
    null,
  );


interface Props {
  children:
    ReactNode;
}


export const AuthProvider = ({
  children,
}: Props) => {
  const [
    accessToken,
    setAccessToken,
  ] =
    useState<string | null>(
      () =>
        localStorage.getItem(
          "accessToken",
        ),
    );


  const [
    user,
    setUser,
  ] =
    useState<UserProfile | null>(
      () => {
        const storedUser =
          localStorage.getItem(
            "user",
          );


        if (!storedUser) {
          return null;
        }


        try {
          return JSON.parse(
            storedUser,
          ) as UserProfile;
        } catch {
          localStorage.removeItem(
            "user",
          );

          return null;
        }
      },
    );


  const login = (
    token: string,
  ) => {
    localStorage.setItem(
      "accessToken",
      token,
    );

    setAccessToken(
      token,
    );
  };


  const setCurrentUser = (
    currentUser:
      UserProfile,
  ) => {
    localStorage.setItem(
      "user",
      JSON.stringify(
        currentUser,
      ),
    );

    setUser(
      currentUser,
    );
  };


  const logout =
    () => {
      localStorage.removeItem(
        "accessToken",
      );

      localStorage.removeItem(
        "refreshToken",
      );

      localStorage.removeItem(
        "user",
      );

      setAccessToken(
        null,
      );

      setUser(
        null,
      );
    };


  const value =
    useMemo(
      () => ({
        user,

        accessToken,

        isAuthenticated:
          Boolean(
            accessToken,
          ),

        login,

        setCurrentUser,

        logout,
      }),
      [
        user,
        accessToken,
      ],
    );


  return (
    <AuthContext.Provider
      value={
        value
      }
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context =
    useContext(
      AuthContext,
    );


  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }


  return context;
};