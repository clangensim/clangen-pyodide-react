function ProgressBar({ value }: { value: number }) {
  return (
    <>
      <div
        className="progress-bar"
        aria-valuenow={value}
        style={{ width: "140px" }}
      >
        <div
          className="progress-bar-value"
          style={{ width: `${value.toString()}%` }}
        ></div>
      </div>
    </>
  );
}

export default ProgressBar;
