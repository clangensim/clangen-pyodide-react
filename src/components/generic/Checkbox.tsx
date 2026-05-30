import { useId } from "react";

function Checkbox({
  label,
  checked,
  onChange,
  className,
  disabled,
}: {
  label: React.ReactNode;
  checked?: boolean;
  onChange?: () => void;
  className?: string;
  disabled?: boolean
}) {
  const ID = useId();

  return (
    <>
      <div className="checkbox-row">
        <label className={className}>
          <input
            tabIndex={0}
            id={ID}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            type="checkbox"
          />
          {label}
        </label>
      </div>
    </>
  );
}

export default Checkbox;
