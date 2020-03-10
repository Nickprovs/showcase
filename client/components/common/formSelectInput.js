import Select from "./select";
const FormSelectInput = ({ name, label, error, ...rest }) => {
  return (
    <div>
      <label className="form-label" htmlFor={name}>
        {label}
      </label>
      <br />
      <Select {...rest} name={name} id={name} aria-describedby={name} />
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
