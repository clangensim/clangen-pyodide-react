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

  // https://github.com/mdn/browser-compat-data/issues/26043 - iOS doesn't implement "accept" with filename ext
  const acceptString = (
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPod/i)
    ) ? undefined : accept

  return (
    <>
      <button tabIndex={tabIndex} onClick={handleButtonClick}>
        {children}
      </button>
      <input
        type="file"
        style={{
          display: "none",
        }}
        ref={inputRef}
        onChange={onChange}
        accept={acceptString}
      />
    </>
  );
}

export default FileUploadButton;
