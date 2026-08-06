export interface SendOtpRequest {
  identifier: string;
}

export interface VerifyOtpRequest {
  identifier: string;
  otp: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  alreadySent?: boolean;
  channel?: "EMAIL" | "WHATSAPP";
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;

  accessToken: string;
  refreshToken: string;
}
