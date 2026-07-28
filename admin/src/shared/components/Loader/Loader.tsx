import styles from "./Loader.module.css";

type LoaderSize =
  | "sm"
  | "md"
  | "lg";

interface LoaderProps {
  size?: LoaderSize;
  fullScreen?: boolean;
}

const Loader = ({
  size = "md",
  fullScreen = false,
}: LoaderProps) => {
  const spinner = (
    <span
      className={`${styles.spinner} ${styles[size]}`}
    />
  );

  if (fullScreen) {
    return (
      <div className={styles.fullScreen}>
        {spinner}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {spinner}
    </div>
  );
};

export default Loader;