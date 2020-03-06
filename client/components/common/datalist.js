import datalist from "../../styles/datalist.module.css";
import GuidUtilities from "../../util/guidUtilities";
import { Component } from "react";

export default class Datalist extends Component {
  state = {};

  constructor(props) {
    super(props);
    this.state.generatedId = GuidUtilities.NewGuid();
  }
  render() {
    const { className, children, text, isSelected, value, id, ...rest } = this.props;
    const consumedId = id ? id : this.state.generatedId;

    return (
      <div {...rest}>
        <input list={consumedId} value={value} className={datalist.input} placeholder="select" />
        <datalist id={consumedId}>{children}</datalist>
      </div>
    );
  }
}
