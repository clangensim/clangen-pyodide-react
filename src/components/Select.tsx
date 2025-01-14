import { useId } from "react";

type Option = {
  value: string;
  label: string;
};

function Select({
  options,
  label,
  name,
  value,
  onChange,
}: {
  options: Option[];
  label?: string;
  name?: string;
  value: string;
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
          onChange={(e) => onChange(e.target.value)}
        >
          <option value=""></option>
          {options.map((optionData) => {
            return (
              <option value={optionData["value"]}>{optionData["label"]}</option>
            );
          })}
        </select>
        <div className="dropdown-button"></div>
      </div>
    </>
  );
}

export default Select;
