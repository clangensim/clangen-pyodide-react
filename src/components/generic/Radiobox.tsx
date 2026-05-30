import { useId } from "react";

function Radiobox({
  label,
  checked,
  name,
  value,
  onChange,
  disabled,
}: {
  label: React.ReactNode;
  checked?: boolean;
  name: string;
  value?: string;
  onChange?: () => void;
  disabled?: boolean;
}) {
  const ID = useId();
  const val = value === undefined ? label?.toString() : value;

  return (
    <>
      <div className="radio-row">
        <input
          tabIndex={0}
          id={ID}
          checked={checked}
          onChange={onChange}
          name={name}
          value={val}
          disabled={disabled}
          type="radio"
        />
        <label htmlFor={ID}>{label}</label>
      </div>
    </>
  );
}

export default Radiobox;
