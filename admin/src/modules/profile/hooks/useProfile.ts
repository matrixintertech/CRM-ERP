import {
  useCallback,
  useState,
} from "react";

import {
  notify,
} from "@/shared/utils/notify";

import {
  getProfile,
} from "../api/profile.api";

import type {
  UserProfile,
} from "../types/profile.types";

const getErrorMessage = (
  error: unknown,
  fallbackMessage: string,
) => {
  const apiError = error as {
    response?: {
      data?: {
        message?: string;
        errors?: string[];
      };
    };
  };

  const errors =
    apiError.response?.data?.errors;

  if (
    Array.isArray(errors) &&
    errors.length > 0
  ) {
    return errors.join(", ");
  }

  return (
    apiError.response?.data?.message ??
    fallbackMessage
  );
};

export const useProfile = () => {
  const [
    profile,
    setProfile,
  ] = useState<UserProfile | null>(
    null,
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const fetchProfile =
    useCallback(async () => {
      try {
        setLoading(true);

        const data =
          await getProfile();

        setProfile(data);

        return data;
      } catch (error: unknown) {
        console.error(
          "Failed to load profile:",
          error,
        );

        notify.error(
          getErrorMessage(
            error,
            "Failed to load profile.",
          ),
        );

        throw error;
      } finally {
        setLoading(false);
      }
    }, []);

  const clearProfile =
    useCallback(() => {
      setProfile(null);
    }, []);

  return {
    loading,
    profile,

    fetchProfile,
    clearProfile,
  };
};