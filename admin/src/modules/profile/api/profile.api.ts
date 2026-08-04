import api from "@/shared/services/axios";

import type {
  UserProfile,
} from "../types/profile.types";

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

/**
 * Get logged-in user profile.
 */
export const getProfile =
  async (): Promise<UserProfile> => {
    const { data } =
      await api.get<
        ApiResponse<UserProfile>
      >("/auth/profile");

    return data.data;
  };