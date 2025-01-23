import { useRef } from "react";

function Dialog({
  title,
  opened,
  onClose = () => {},
  children,
}: {
  title: string;
  opened: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  if (opened) {
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  } else {
    if (dialogRef.current && dialogRef.current.open) {
      dialogRef.current.close();
    }
  }

  function handleClose() {
    onClose();
  }

  return (
    <>
      <dialog ref={dialogRef}>
        <div className="window">
          <div className="title-bar active">
            <div className="title-bar-text">{title}</div>
            <div className="title-bar-buttons">
              <button data-close="" onClick={handleClose} />
            </div>
          </div>
          <div className="window-body">{children}</div>
        </div>
      </dialog>
    </>
  );
}

export default Dialog;
