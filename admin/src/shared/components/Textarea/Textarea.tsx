import type {
  TextareaHTMLAttributes,
} from "react";

import styles from "./Textarea.module.css";

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = ({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}: TextareaProps) => {
  return (
    <div className={styles.field}>
      {label && (
        <label
          htmlFor={id}
          className={styles.label}
        >
          {label}
        </label>
      )}

      <textarea
        id={id}
        className={`${styles.textarea} ${className}`}
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

export default Textarea;