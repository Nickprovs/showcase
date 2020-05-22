import Select from "react-select";
import { styles as customReactSelectStyles, theme as customReactSelectTheme } from "../../misc/customReactSelectStyles";

const FormSelectInput = ({ options, name, label, error, ...rest }) => {
  return (
    <div>
      <label className="form-label" htmlFor={name}>
        {label}
      </label>
      <br />
      <Select
        {...rest}
        options={options}
        name={name}
        id={name}
        aria-describedby={name}
        isSearchable={false}
        theme={customReactSelectTheme}
        styles={customReactSelectStyles("95%", 45)}
      />
      {error && (
        <div>
          <label className="form-label-error" htmlFor={name}>
            {error}
          </label>
        </div>
      )}
    </div>
  );
};

export default FormSelectInput;
