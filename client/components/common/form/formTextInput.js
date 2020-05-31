const FormTextInput = ({ name, label, error, ...rest }) => {
  return (
    <div>
      <label className="form-label" htmlFor={name}>
        {label}
      </label>
      <br />
      <input {...rest} className="form-control" name={name} id={name} aria-describedby={name} />
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

export default FormTextInput;
