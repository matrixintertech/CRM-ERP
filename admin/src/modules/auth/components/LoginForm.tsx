import { useState, type FormEvent } from "react";

import Button from "@/shared/components/Button";
import Input from "@/shared/components/Input";

import { sendOtp } from "../api/auth.api";

interface Props {
  onSuccess: (identifier: string) => void;
}

const LoginForm = ({ onSuccess }: Props) => {
  const [identifier, setIdentifier] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedIdentifier = identifier.trim();

    if (!normalizedIdentifier) {
      setError("Email address or mobile number is required.");

      return;
    }

    try {
      setLoading(true);
      setError("");

      await sendOtp({
        identifier: normalizedIdentifier,
      });

      onSuccess(normalizedIdentifier);
    } catch (error: any) {
      setError(
        error.response?.data?.message ??
          "Unable to send OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        id="identifier"
        label="Email or Mobile Number"
        type="text"
        placeholder="Enter email or mobile number"
        value={identifier}
        onChange={(event) => {
          setIdentifier(event.target.value);

          if (error) {
            setError("");
          }
        }}
        error={error}
        autoComplete="username"
        autoFocus
      />

      <Button type="submit" fullWidth loading={loading}>
        Send OTP
      </Button>
    </form>
  );
};

export default LoginForm;
