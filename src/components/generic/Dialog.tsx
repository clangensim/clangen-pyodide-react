import { useEffect, useRef } from "react";
import { TbX } from "react-icons/tb";

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

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.addEventListener("cancel", () => onClose());
    }
  }, [dialogRef]);

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
          <div className="title-bar">
            <div className="title-bar-text">{title}</div>
            <div className="title-bar-buttons">
              <button className="icon-button" onClick={handleClose}><TbX /></button>
            </div>
          </div>
          <div className="window-body">{children}</div>
        </div>
      </dialog>
    </>
  );
}

export default Dialog;
