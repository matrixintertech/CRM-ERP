import type { InputHTMLAttributes } from "react";

import styles from "./SearchInput.module.css";

interface SearchInputProps
  extends InputHTMLAttributes<HTMLInputElement> {}

const SearchInput = ({
  className = "",
  ...props
}: SearchInputProps) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>
        🔍
      </span>

      <input
        type="search"
        className={`${styles.input} ${className}`}
        placeholder="Search..."
        {...props}
      />
    </div>
  );
};

export default SearchInput;