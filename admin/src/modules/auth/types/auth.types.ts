export type OtpChannel =
  | "EMAIL"
  | "MOBILE";

export interface SendOtpRequest {
  receiver: string;
  channel: OtpChannel;
}

export interface VerifyOtpRequest {
  receiver: string;
  otp: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    displayName: string;
    companyId?: string;
    userType: string;
  };
}