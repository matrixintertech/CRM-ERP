import Modal from "@/shared/components/Modal";
import Button from "@/shared/components/Button";
import styles from "./ConfirmDialog.module.css";

interface Props {
  open: boolean;

  title?: string;

  message: string;

  loading?: boolean;

  confirmText?: string;

  cancelText?: string;

  confirmVariant?:
    | "primary"
    | "success"
    | "danger";

  onConfirm: () => void;

  onClose: () => void;
}

const ConfirmDialog = ({
  open,
  title = "Confirmation",
  message,
  loading = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "danger",
  onConfirm,
  onClose,
}: Props) => {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button
            variant="secondary"
            onClick={onClose}
          >
            {cancelText}
          </Button>

          <Button
            variant={confirmVariant}
            loading={loading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <p className={styles.message}>
    {message}
    </p>
    </Modal>
  );
};

export default ConfirmDialog;