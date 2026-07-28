import api from "../../../shared/services/axios";
import type {SendOtpRequest, VerifyOtpRequest} from "../types/auth.types";

export const sendOtp = async (
  payload: SendOtpRequest,
) => {
  const { data } = await api.post(
    "/auth/send-otp",
    payload,
  );

  return data;
};

export const verifyOtp = async (
  payload: VerifyOtpRequest,
) => {
  const { data } = await api.post(
    "/auth/verify-otp",
    payload,
  );

  return data;
};


export const getProfile = async () => {
  const { data } = await api.get("/auth/profile");

  return data;
};