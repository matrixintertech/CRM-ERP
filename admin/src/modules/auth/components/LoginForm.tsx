import { useState } from "react";

import Button from "@/shared/components/Button";
import Input from "@/shared/components/Input";

import { sendOtp } from "../api/auth.api";

interface Props {
  onSuccess: (receiver: string) => void;
}

const LoginForm = ({
  onSuccess,
}: Props) => {
  const [receiver, setReceiver] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (!receiver.trim()) {
      setError(
        "Email is required.",
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await sendOtp({
          receiver,
          channel: "EMAIL",
        });

      console.log(
        response.message,
      );

      onSuccess(receiver);
    } catch (err: any) {
      setError(
        err.response?.data
          ?.message ??
          "Unable to send OTP.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
    >

      <Input
        id="email"
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        value={receiver}
        onChange={(e) =>
          setReceiver(
            e.target.value,
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
        Send OTP
      </Button>
    </form>
  );
};

export default LoginForm;