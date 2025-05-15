import { useId } from "react";

function Radiobox({
  label,
  checked,
  name,
  value,
  onChange,
}: {
  label: string;
  checked?: boolean;
  name: string;
  value?: string;
  onChange?: () => void;
}) {
  const ID = useId();
  const val = value === undefined ? label : value;

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
          type="radio"
        />
        <label htmlFor={ID}>{label}</label>
      </div>
    </>
  );
}

export default Radiobox;
