import Header from "./header";
import Footer from "./footer";
import Sidebar from "./sidebar";
import Theme from "./common/theme";

const contentStyle = {
  zIndex: 2,
  backgroundColor: "green",
  margin: "0px",
  padding: "0px"
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
  width: "100%",
  height: "100vh",
  backgroundColor: "blue"
};

const internalPages = [
  {
    href: "/index",
    label: "Home"
  },
  {
    href: "/showcase",
    label: "Showcase",
    iconClasses: ""
  },
  {
    href: "/blog",
    label: "Blog",
    iconClasses: ""
  },
  {
    href: "/contact",
    label: "Contact",
    iconClasses: ""
  }
];

const externalPages = [
  {
    href: "http://www.linkedin.com/in/nickprovs/",
    iconClasses: "fab fa-linkedin",
    label: "LinkedIn"
  },
  {
    href: "http://www.github.com/Nickprovs",
    iconClasses: "fab fa-github",
    label: "Github"
  },
  {
    href: "http://www.instagram.com/nickprovs/",
    iconClasses: "fab fa-instagram",
    label: "Instagram"
  }
];

export default function Layout(props) {
  return (
    <Theme variables={Theme.Dark}>
      <div style={containerStyle}>
        <Sidebar internalPages={internalPages} externalPages={externalPages} />

        <div style={layoutStyle}>
          <Header internalPages={internalPages} externalPages={externalPages} />
          <div style={contentStyle}>{props.children}</div>
          <Footer externalPages={externalPages} />
        </div>
      </div>
    </Theme>
  );
}
