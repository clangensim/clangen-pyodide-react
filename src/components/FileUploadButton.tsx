import { ChangeEventHandler, useRef } from "react";

function FileUploadButton({
  children,
  onChange,
  tabIndex,
}: {
  children?: JSX.Element | string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  tabIndex?: number;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleButtonClick() {
    if (inputRef.current !== null) {
      inputRef.current.click();
    }
  }

  return (
    <>
      <button tabIndex={tabIndex} onClick={handleButtonClick}>{children}</button>
      <input
        type="file"
        style={{
          display: "none",
        }}
        ref={inputRef}
        onChange={onChange}
      />
    </>
  );
}

export default FileUploadButton;
