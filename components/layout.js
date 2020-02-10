import { Component } from "react";
import NamePlate from "./namePlate";
import Header from "./header";
import Footer from "./footer";
import Sidebar from "./sidebar";
import Theme from "./common/theme";
import Dimmer from "./dimmer";
import layout from "../styles/layout.module.css";

const contentStyle = {
  zIndex: 3,
  backgroundColor: "var(--b1)",
  margin: "0px",
  padding: "0px"
};

const containerStyle = {
  width: "100%",
  height: "100vh"
};

const internalPages = [
  {
    href: "/index",
    label: "HOME"
  },
  {
    href: "/showcase",
    label: "SHOWCASE",
    iconClasses: ""
  },
  {
    href: "/blog",
    label: "BLOG",
    iconClasses: ""
  },
  {
    href: "/contact",
    label: "CONTACT",
    iconClasses: ""
  }
];

const externalPages = [
  {
    href: "http://www.linkedin.com/in/nickprovs/",
    iconClasses: "fab fa-linkedin-in",
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

export default class Layout extends Component {
  state = {
    isSidebarOpen: false
  };

  handleToggleSidebar(openStatus) {
    this.setState({ isSidebarOpen: openStatus });
  }

  render() {
    const { children } = this.props;
    const { isSidebarOpen } = this.state;
    return (
      <Theme variables={Theme.Light}>
        <div style={containerStyle}>
          <div className={layout.background} />
          <Sidebar
            onSetSidebarOpen={openStatus => this.handleToggleSidebar(openStatus)}
            isSidebarOpen={isSidebarOpen}
            internalPages={internalPages}
            externalPages={externalPages}
          />
          <Dimmer on={isSidebarOpen} />
          <div className={layout.layoutStyle}>
            <NamePlate />
            <Header internalPages={internalPages} externalPages={externalPages} />
            <div style={contentStyle}>{children}</div>
            <Footer externalPages={externalPages} />
          </div>
        </div>
      </Theme>
    );
  }
}
