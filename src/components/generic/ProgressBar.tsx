function ProgressBar({ value }: { value: number }) {
  return (
    <>
      <div>
        <meter
          min={0} max={100}
          value={value}
          aria-valuenow={value}
          style={{ width: "140px", height: "1.5em" }}
        >
        </meter>
      </div>
    </>
  );
}

export default ProgressBar;
