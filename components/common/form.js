import { Component } from "react";
import Input from "./input";
import FormTextArea from "./formTextArea";
import Joi from "@hapi/joi";
import ReCAPTCHA from "react-google-recaptcha";

class Form extends Component {
  state = {
    data: {},
    errors: {},
    captchaInUse: false,
    captchaPassed: false
  };

  constructor() {
    super();

    this.recaptcha = null;
    this.setRecaptcha = element => {
      this.recaptcha = element;
    };
  }

  validateProperty({ name, value }) {
    const propertyToValidateAsObject = { [name]: value };
    const schemaForProperty = Joi.object({ [name]: this.schema.extract(name) });
    const { error } = schemaForProperty.validate(propertyToValidateAsObject);
    return error ? error.details[0].message : null;
  }

  validate() {
    const options = { abortEarly: false };
    console.log("schema", this.schema);
    const { error } = this.schema.validate(this.state.data, options);
    const { captchaPassed, captchaInUse } = this.state;

    const errors = {};
    if (error) {
      for (let item of error.details) errors[item.path[0]] = item.message;
    }

    const captchaValid = !captchaInUse || captchaPassed;
    const isValid = Object.entries(errors).length === 0 && captchaValid;
    return { isValid: isValid, errors: errors };
  }

  handleSubmit = e => {
    e.preventDefault();
    const validationResult = this.validate();
    this.setState({ errors: validationResult.errors || {} });
    if (!validationResult.isValid) return;

    if (this.recaptcha) {
      this.recaptcha.reset();
      this.setState({ captchaPassed: false });
    }
    this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) {
      errors[input.name] = errorMessage;
    } else {
      delete errors[input.name];
    }
    const data = { ...this.state.data };
    if (input) {
      data[input.name] = input.type === "checkbox" ? input.checked : input.value;
    }
    this.setState({ errors, data });
  };

  renderButton(label) {
    return (
      <button disabled={this.validate().isValid ? "" : "disabled"} type="submit" className="btn btn-primary">
        {label}
      </button>
    );
  }

  renderInput(name, label, type = "text") {
    return (
      <Input
        name={name}
        label={label}
        value={this.state.data[name]}
        onChange={this.handleChange}
        error={this.state.errors[name]}
        type={type}
      />
    );
  }

  renderTextArea(name, label) {
    return (
      <FormTextArea name={name} label={label} value={this.state.data[name]} onChange={this.handleChange} error={this.state.errors[name]} />
    );
  }
  onCaptchaChange(value) {
    this.setState({ captchaPassed: value !== null });
  }

  renderRecaptcha() {
    if (!this.state.captchaInUse) this.setState({ captchaInUse: true });
    return (
      <ReCAPTCHA
        ref={this.setRecaptcha}
        style={{ marginTop: "10px" }}
        size="normal"
        onChange={value => this.onCaptchaChange(value)}
        sitekey="6LdhjtcUAAAAAOIfWZRUu81PNIRcau2OouRlLQn7"
      />
    );
  }
}

export default Form;
