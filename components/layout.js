import Header from "./header";
import Theme from "./common/theme";

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: "1px solid #DDD",
  backgroundColor: "var(--b1)",
  color: "var(--f1)"
};

export default function Layout(props) {
  return (
    <Theme variables={Theme.Dark}>
      <div style={layoutStyle}>
        <Header />
        {props.children}
      </div>
    </Theme>
  );
}
