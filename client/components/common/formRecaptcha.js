import ReCAPTCHA from "react-google-recaptcha";

const FormRecaptcha = React.forwardRef(({ name, label, error, ...rest }, ref) => (
  <div>
    <label className="form-label" htmlFor={name}>
      {label}
    </label>
    <br />
    <ReCAPTCHA {...rest} ref={ref} size="normal" />
    {error && (
      <div>
        <label className="form-label-error" htmlFor={name}>
          {error}
        </label>
      </div>
    )}
  </div>
));

export default FormRecaptcha;
