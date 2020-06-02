import datalist from "../../../styles/common/dropdown/datalist.module.css";
import GuidUtilities from "../../../util/guidUtilities";
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
      <div>
        <input {...rest} list={consumedId} value={value} className={datalist.input} />
        <datalist id={consumedId}>
          {children.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </datalist>
      </div>
    );
  }
}
