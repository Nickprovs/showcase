import Header from "./header";
import Sidebar from "./sidebar";
import Theme from "./common/theme";

const contentStyle = {
  backgroundColor: "green",
  margin: 0,
  padding: 0
};

const layoutStyle = {
  paddingTop: "10vmin",
  paddingLeft: "10vw",
  paddingRight: "10vw",
  paddingBottom: "10vmin",
  backgroundColor: "var(--b1)",
  color: "var(--f1)"
};

const containerStyle = {
  overflow: "auto",
  width: "100vw",
  height: "100vh",
  backgroundColor: "blue"
};

const menuPages = [
  {
    href: "/",
    label: "Home1"
  },
  {
    href: "/",
    label: "Home2"
  },
  {
    href: "/",
    label: "Home3"
  },
  {
    href: "/",
    label: "Home4"
  }
];

export default function Layout(props) {
  return (
    <Theme variables={Theme.Dark}>
      <div style={containerStyle}>
        <div style={layoutStyle}>
          <Header pages={menuPages} />
          <Sidebar pages={menuPages} />
          <div style={contentStyle}>{props.children}</div>
        </div>
      </div>
    </Theme>
  );
}
