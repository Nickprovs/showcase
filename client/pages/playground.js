import Layout from "../components/layout";
import Select, { components } from "react-select";
import Icon from "../components/common/icon";
import TransparentButton from "../components/common/transparentButton";
import withAuthAsync from "../components/common/withAuthAsync";
import withLayoutAsync from "../components/common/withLayoutAsync";

const options = [
  {
    label: "text 1",
    subLabel: "subtext 1",
    value: "1",
  },
  {
    label: "text 2",
    subLabel: "subtext 2",
    value: "2",
  },
  {
    label: "text 3",
    subLabel: "subtext 3",
    value: "3",
  },
  {
    label: "text 4",
    subLabel: "subtext 4",
    value: "4",
  },
];

const Option = (props) => {
  return (
    <components.Option {...props}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {props.data.label}
        <div>
          <TransparentButton onClick={(e) => e.preventDefault()} style={{ marginLeft: "auto", marginRight: "0", color: "var(--f1)" }}>
            <Icon className="fas fa-edit"></Icon>
          </TransparentButton>
          <TransparentButton
            onClick={() => console.log("delete clicked")}
            style={{ marginLeft: "auto", marginRight: "0", color: "var(--f1)" }}
          >
            <Icon className="fas fa-trash"></Icon>
          </TransparentButton>
        </div>
      </div>
    </components.Option>
  );
};

function Playground() {
  return (
    <div>
      <Select options={options} components={{ Option }} />
    </div>
  );
}

export default withAuthAsync(withLayoutAsync(Playground));
