import { ChangeEventHandler, useRef } from "react";

function FileUploadButton({
  children,
  onChange,
  tabIndex,
  accept,
}: {
  children?: JSX.Element | string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  tabIndex?: number;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleButtonClick() {
    if (inputRef.current !== null) {
      inputRef.current.click();
    }
  }

  return (
    <>
      <button className="btn" tabIndex={tabIndex} onClick={handleButtonClick}>
        {children}
      </button>
      <input
        type="file"
        style={{
          display: "none",
        }}
        ref={inputRef}
        onChange={onChange}
        accept={accept}
      />
    </>
  );
}

export default FileUploadButton;
