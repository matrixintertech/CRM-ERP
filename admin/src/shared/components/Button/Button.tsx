import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import styles from "./Button.module.css";

type Variant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "outline";

type Size =
  | "sm"
  | "md"
  | "lg";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;

  variant?: Variant;

  size?: Size;

  loading?: boolean;

  fullWidth?: boolean;
}

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={[
        styles.button,
        styles[variant],
        styles[size],
        fullWidth
          ? styles.fullWidth
          : "",
        className,
      ].join(" ")}
      disabled={
        disabled || loading
      }
      {...props}
    >
      {loading
        ? "Loading..."
        : children}
    </button>
  );
};

export default Button;