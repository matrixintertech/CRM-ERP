import type {
  SelectHTMLAttributes,
} from "react";

import styles from "./Select.module.css";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  fullWidth?: boolean;
}

const Select = ({
  label,
  error,
  helperText,
  options,
  fullWidth = true,
  className = "",
  id,
  ...props
}: SelectProps) => {
  return (
    <div
      className={`${styles.wrapper} ${
        fullWidth
          ? styles.fullWidth
          : ""
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

      <select
        id={id}
        className={`${styles.select} ${
          error
            ? styles.errorInput
            : ""
        } ${className}`}
        {...props}
      >
        <option value="">
          Select
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error ? (
        <small className={styles.error}>
          {error}
        </small>
      ) : (
        helperText && (
          <small
            className={styles.helper}
          >
            {helperText}
          </small>
        )
      )}
    </div>
  );
};

export default Select;