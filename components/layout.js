import NamePlate from "./namePlate";
import Header from "./header";
import Footer from "./footer";
import Sidebar from "./sidebar";
import Theme from "./common/theme";
import layout from "../styles/layout.module.css";

const contentStyle = {
  zIndex: 2,
  backgroundColor: "green",
  margin: "0px",
  padding: "0px"
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
        <div className={layout.layoutStyle}>
          <NamePlate />
          <Header internalPages={internalPages} externalPages={externalPages} />
          <div style={contentStyle}>{props.children}</div>
          <Footer externalPages={externalPages} />
        </div>
      </div>
    </Theme>
  );
}
