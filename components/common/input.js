const Input = ({ name, label, error, ...rest }) => {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={name}>
        {label}
      </label>
      <br />
      <input {...rest} className="form-control" name={name} id={name} aria-describedby={name} placeholder={label} />
      {error && (
        <div>
          <label className="form-label" htmlFor={name}>
            {error}
          </label>
        </div>
      )}{" "}
    </div>
  );
};

export default Input;