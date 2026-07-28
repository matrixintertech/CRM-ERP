import type { InputHTMLAttributes } from "react";
import styles from "./Input.module.css";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const Input = ({
  label,
  error,
  helperText,
  fullWidth = true,
  className = "",
  id,
  ...props
}: InputProps) => {
  return (
    <div
      className={`${styles.wrapper} ${
        fullWidth ? styles.fullWidth : ""
      }`}
    >
      {label && (
        <label
          htmlFor={id}
          className={styles.label}
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={`${styles.input} ${
          error ? styles.errorInput : ""
        } ${className}`}
        {...props}
      />

      {error ? (
        <small className={styles.error}>
          {error}
        </small>
      ) : (
        helperText && (
          <small className={styles.helper}>
            {helperText}
          </small>
        )
      )}
    </div>
  );
};

export default Input;