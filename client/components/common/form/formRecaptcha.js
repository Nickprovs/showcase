import ReCAPTCHA from "react-google-recaptcha";
import { forwardRef } from 'react';

const FormRecaptcha = forwardRef(({ name, label, error, darkModeOn, ...rest }, ref) => (
  <div>
    <label className="form-label" htmlFor={name}>
      {label}
    </label>
    <br />
    <ReCAPTCHA {...rest} ref={ref} size="normal" theme={darkModeOn ? "dark" : "light"} />
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
