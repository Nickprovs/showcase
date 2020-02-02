import Header from "./header";
import Sidebar from "./sidebar";
import Theme from "./common/theme";

const contentStyle = {
  margin: "10vw",
  padding: 40,
  backgroundColor: "green"
};

const layoutStyle = {
  backgroundColor: "var(--b1)",
  color: "var(--f1)"
};

const containerStyle = {
  width: "100vw",
  height: "100vh",
  margin: 0,
  padding: 0,
  backgroundColor: "blue"
};

export default function Layout(props) {
  return (
    <Theme variables={Theme.Dark}>
      <div style={containerStyle}>
        <div style={layoutStyle}>
          <Header />
          <Sidebar />
          <div style={contentStyle}>{props.children}</div>
        </div>
      </div>
    </Theme>
  );
}
