function ProgressBar({ value }: { value: number }) {
  return (
    <>
      <div>
        <meter
          min={0} max={100}
          value={value}
          aria-valuenow={value}
          style={{ width: "140px" }}
        >
        </meter>
      </div>
    </>
  );
}

export default ProgressBar;
