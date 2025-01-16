import { ChangeEventHandler, useRef } from "react";

function FileUploadButton({children, onChange}: {children?: JSX.Element | string, onChange?: ChangeEventHandler<HTMLInputElement>}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleButtonClick() {
    if (inputRef.current !== null) {
      inputRef.current.click();
    }
  }

  return (
    <>
      <button onClick={handleButtonClick}>{children}</button>
      <input
        type="file"
        style={{
          display: "none"
        }}
        ref={inputRef}
        onChange={onChange}
      />
    </>
  )
}

export default FileUploadButton;
