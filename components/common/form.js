import { Component } from "react";
import Input from "./input";
import Joi from "@hapi/joi";

class Form extends Component {
  state = {
    data: {},
    errors: {}
  };

  validateProperty({ name, value }) {
    const propertyToValidateAsObject = { [name]: value };
    const schemaForProperty = Joi.object({ [name]: this.schema.extract(name) });
    const { error } = schemaForProperty.validate(propertyToValidateAsObject);
    return error ? error.details[0].message : null;
  }

  validate() {
    const options = { abortEarly: false };
    const { error } = this.schema.validate(this.state.data, options);

    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  }

  handleSubmit = e => {
    e.preventDefault();
    const errors = this.validate();
    console.log("submission errors", errors);
    this.setState({ errors: errors || {} });
    if (errors) return;
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
      <button disabled={this.validate() ? "disabled" : ""} type="submit" className="btn btn-primary">
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
}

export default Form;
