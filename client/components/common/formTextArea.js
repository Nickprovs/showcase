const FormTextArea = ({ name, label, placeholder, error, ...rest }) => {
  return (
    <div>
      <label className="form-label" htmlFor={name}>
        {label}
      </label>
      <br />
      <textarea
        {...rest}
        className="form-control form-text-area"
        name={name}
        id={name}
        aria-describedby={name}
        placeholder={placeholder}
      ></textarea>
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

export default FormTextArea;
