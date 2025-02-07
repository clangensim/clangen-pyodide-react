import { useId } from "react";

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked?: boolean;
  onChange?: () => void;
}) {
  const ID = useId();

  return (
    <>
      <div className="checkbox-row">
        <input
          tabIndex={0}
          id={ID}
          checked={checked}
          onChange={onChange}
          type="checkbox"
        />
        <label htmlFor={ID}>{label}</label>
      </div>
    </>
  );
}

export default Checkbox;
