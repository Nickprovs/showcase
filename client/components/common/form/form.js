import { Component } from "react";
import FormTextInput from "./formTextInput";
import FormTextArea from "./formTextArea";
import FormSelectInput from "./formSelectInput";
import FormDatalist from "./formDatalist";
import FormHtmlEditor from "./formHtmlEditor";
import CustomJoi from "../../../misc/customJoi";
import BasicButton from "../button/basicButton";
import FormRecaptcha from "./formRecaptcha";

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  constructor() {
    super();
    this.recaptchaRef = React.createRef();
  }

  validateProperty(name, value) {
    const propertyToValidateAsObject = { [name]: value };
    const schemaForProperty = CustomJoi.object({ [name]: this.schema.extract(name) });
    const { error } = schemaForProperty.validate(propertyToValidateAsObject);
    return error ? error.details[0].message : null;
  }

  validate() {
    const options = { abortEarly: false };
    const { error } = this.schema.validate(this.state.data, options);

    const errors = {};
    if (error) {
      for (let item of error.details) errors[item.path[0]] = item.message;
    }

    const isValid = Object.entries(errors).length === 0;
    return { isValid: isValid, errors: errors };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const validationResult = this.validate();
    this.setState({ errors: validationResult.errors || {} });
    if (!validationResult.isValid) return;
    this.doSubmit();
  };

  //Needs... "name" of input, "value" of input, "type" of input
  handleChange = (inputName, inputValue, inputType) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(inputName, inputValue);
    if (errorMessage) {
      errors[inputName] = errorMessage;
    } else {
      delete errors[inputName];
    }
    const data = { ...this.state.data };
    if (inputName) {
      data[inputName] = inputType === "checkbox" ? input.checked : inputValue;
    }
    this.setState({ errors, data });
  };

  renderButton(label) {
    return (
      <BasicButton style={{ marginTop: "15px" }} disabled={this.validate().isValid ? "" : "disabled"} type="submit">
        {label}
      </BasicButton>
    );
  }

  renderTextInput(name, label, placeholder = "", type = "text") {
    return (
      <FormTextInput
        name={name}
        placeholder={placeholder}
        label={label}
        value={this.state.data[name]}
        onChange={(e) => this.handleChange(e.currentTarget.name, e.currentTarget.value, e.currentTarget.type)}
        error={this.state.errors[name]}
        type={type}
      />
    );
  }

  renderTextArea(name, label, placeholder = "") {
    return (
      <FormTextArea
        name={name}
        label={label}
        placeholder={placeholder}
        value={this.state.data[name]}
        onChange={(e) => this.handleChange(e.currentTarget.name, e.currentTarget.value, e.currentTarget.type)}
        error={this.state.errors[name]}
      />
    );
  }

  renderSelect(name, label, placeholder = "", options, path) {
    const optionsFormattedForSelect = options ? options.map((o) => ({ value: o, label: path ? o[path] : o })) : null;
    const currentValueFormattedForSelect = this.state.data[name]
      ? { value: this.state.data[name], label: path ? this.state.data[name][path] : this.state.data[name] }
      : null;

    return (
      <FormSelectInput
        instanceId={`select_${name}`}
        name={name}
        label={label}
        placeholder={placeholder}
        value={currentValueFormattedForSelect}
        onChange={(selected) => this.handleChange(name, selected.value, "select")}
        error={this.state.errors[name]}
        options={optionsFormattedForSelect}
      />
    );
  }

  renderDatalist(name, label, placeholder = "", children) {
    return (
      <FormDatalist
        name={name}
        label={label}
        placeholder={placeholder}
        value={this.state.data[name]}
        onChange={(e) => this.handleChange(e.currentTarget.name, e.currentTarget.value, e.currentTarget.type)}
        error={this.state.errors[name]}
        children={children}
      />
    );
  }

  renderHtmlEditor(name, label, darkModeOn = false) {
    //When doing client-side nav... the head does not always contain the scripts defined in head by an individual page
    //As a result, the necessary script is loaded for every page in app.js. So this script should be there.
    if (typeof document !== "undefined") {
      if (document.querySelectorAll(`script[src="/scripts/tinymce/tinymce.min.js"]`).length < 1)
        throw new Error("Must import tinymce.min.js script in head of html file. \n");
    }

    return (
      <FormHtmlEditor
        name={name}
        darkModeOn={darkModeOn}
        label={label}
        value={this.state.data[name]}
        onEditorChange={(e) => this.handleChange(name, e, "text")}
        error={this.state.errors[name]}
      />
    );
  }

  renderRecaptcha(name, label, sitekey, darkModeOn) {
    return (
      <FormRecaptcha
        ref={this.recaptchaRef}
        name={name}
        label={label}
        onChange={(value) => this.handleChange(name, value, "captcha")}
        sitekey={sitekey}
        darkModeOn={darkModeOn}
      />
    );
  }

  resetRecaptcha() {
    if (!this.recaptchaRef.current) return;

    this.recaptchaRef.current.reset();
    this.recaptchaRef.current.props.onChange("");
  }
}

export default Form;
