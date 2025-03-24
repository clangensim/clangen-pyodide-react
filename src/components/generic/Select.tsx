import { useId } from "react";

type SelectOption = {
  value: string;
  label: string;
};

function Select({
  options,
  label,
  name,
  disabled,
  value,
  noEmpty,
  onChange,
}: {
  options: SelectOption[];
  label?: string;
  name?: string;
  disabled?: boolean;
  value: string;
  noEmpty?: boolean;
  onChange: (val: string) => void;
}) {
  const id = useId();

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <div className="dropdown">
        <select
          id={id}
          name={name}
          size={1}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        >
          {!noEmpty && <option value=""></option>}
          {options.map((optionData, index) => {
            return (
              <option key={index} value={optionData["value"]}>
                {optionData["label"]}
              </option>
            );
          })}
        </select>
        <div className="dropdown-button"></div>
      </div>
    </>
  );
}

export default Select;
export type { SelectOption };
