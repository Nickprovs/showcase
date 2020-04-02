import Select from "./select";
const FormSelectInput = ({ children, name, label, error, ...rest }) => {
  return (
    <div>
      <label className="form-label" htmlFor={name}>
        {label}
      </label>
      <br />
      <Select {...rest} children={children} name={name} id={name} aria-describedby={name} style={{width: "95%"}}/>
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
