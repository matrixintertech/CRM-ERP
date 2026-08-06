import { useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import OtpInput from "react-otp-input";

import Button from "@/shared/components/Button";

import { getProfile, verifyOtp } from "../api/auth.api";

import { useAuth } from "@/app/providers/AuthProvider";

import styles from "../styles/LoginPage.module.css";

interface Props {
  identifier: string;
  onBack: () => void;
}

const OtpForm = ({ identifier, onBack }: Props) => {
  const navigate = useNavigate();

  const { login, setCurrentUser } = useAuth();

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const verifyingRef = useRef(false);

  const handleVerifyOtp = async (otpValue: string) => {
    if (otpValue.length !== 6 || verifyingRef.current) {
      return;
    }

    try {
      verifyingRef.current = true;

      setLoading(true);
      setError("");

      const response = await verifyOtp({
        identifier: identifier.trim(),

        otp: otpValue,
      });

      login(response.data.accessToken);

      localStorage.setItem("refreshToken", response.data.refreshToken);

      const profile = await getProfile();

      setCurrentUser(profile.data);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (error: unknown) {
      const apiError = error as {
        response?: {
          data?: {
            message?: string;
          };
        };
      };

      setError(apiError.response?.data?.message ?? "Invalid OTP.");

      setOtp("");
    } finally {
      verifyingRef.current = false;
      setLoading(false);
    }
  };

  const handleOtpChange = (value: string) => {
    const numericOtp = value.replace(/\D/g, "").slice(0, 6);

    setError("");
    setOtp(numericOtp);

    if (numericOtp.length === 6) {
      void handleVerifyOtp(numericOtp);
    }
  };

  return (
    <div>
      <h3>Verify OTP</h3>

      <p>Enter the 6-digit verification code sent to</p>

      <p className={styles.otpReceiver}>{identifier}</p>

      <div className={styles.otpWrapper}>
        <label className={styles.otpLabel}>One-Time Password</label>

        <OtpInput
          value={otp}
          onChange={handleOtpChange}
          numInputs={6}
          shouldAutoFocus
          inputType="tel"
          containerStyle={styles.otpContainer}
          renderInput={(inputProps) => (
            <input
              {...inputProps}
              disabled={loading}
              inputMode="numeric"
              autoComplete="one-time-code"
              className={styles.otpInput}
              aria-label="OTP digit"
            />
          )}
        />

        {error && <p className={styles.otpError}>{error}</p>}

        {loading && <p className={styles.otpStatus}>Verifying OTP...</p>}
      </div>

      <Button
        type="button"
        variant="outline"
        fullWidth
        disabled={loading}
        onClick={onBack}
      >
        Change Email or Mobile
      </Button>
    </div>
  );
};

export default OtpForm;
