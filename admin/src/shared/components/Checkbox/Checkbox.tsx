import type {
  InputHTMLAttributes,
} from "react";

import styles from "./Checkbox.module.css";

interface CheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type"
  > {
  label?: string;

  helperText?: string;

  error?: string;
}

const Checkbox = ({
  label,
  helperText,
  error,
  className = "",
  id,
  ...props
}: CheckboxProps) => {
  return (
    <div className={styles.wrapper}>
      <label
        htmlFor={id}
        className={styles.container}
      >
        <input
          id={id}
          type="checkbox"
          className={`${styles.checkbox} ${className}`}
          {...props}
        />

        {label && (
          <span className={styles.label}>
            {label}
          </span>
        )}
      </label>

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

export default Checkbox;