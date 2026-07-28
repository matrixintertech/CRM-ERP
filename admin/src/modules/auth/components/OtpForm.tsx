import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/shared/components/Button";
import Input from "@/shared/components/Input";

import {
  verifyOtp,
  getProfile,
} from "../api/auth.api";

import { useAuth } from "@/app/providers/AuthProvider";

interface Props {
  receiver: string;
  onBack: () => void;
}

const OtpForm = ({
  receiver,
  onBack,
}: Props) => {
  const navigate = useNavigate();

  const {
    login,
    setCurrentUser,
  } = useAuth();

  const [otp, setOtp] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setError(
        "Please enter a valid 6-digit OTP.",
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await verifyOtp({
          receiver,
          otp,
        });

      login(
        response.data.accessToken,
      );

      localStorage.setItem(
  "refreshToken",
  response.data.refreshToken,
);

      const profile =
        await getProfile();

      setCurrentUser(
        profile.data,
      );

      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data
          ?.message ??
          "Invalid OTP.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Verify OTP</h3>

      <p>
        Enter the 6-digit verification
        code sent to
      </p>

      <p
        style={{
          fontWeight: 600,
          marginBottom: 24,
        }}
      >
        {receiver}
      </p>

      <Input
        id="otp"
        label="One-Time Password"
        type="text"
        placeholder="Enter 6-digit OTP"
        maxLength={6}
        inputMode="numeric"
        autoComplete="one-time-code"
        value={otp}
        onChange={(e) =>
          setOtp(
            e.target.value.replace(
              /\D/g,
              "",
            ),
          )
        }
        error={error}
        autoFocus
      />

      <Button
        type="submit"
        fullWidth
        loading={loading}
      >
        Verify OTP
      </Button>

      <Button
        type="button"
        variant="outline"
        fullWidth
        onClick={onBack}
      >
        Change Email
      </Button>
    </form>
  );
};

export default OtpForm;