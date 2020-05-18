import { Component } from "react";
import NamePlate from "./namePlate";
import Header from "./header";
import Footer from "./footer";
import Sidebar from "./sidebar";
import Theme from "./common/theme";
import Dimmer from "./dimmer";
import layout from "../styles/layout.module.css";
import { logoutAsync } from "../services/authService";
import Router from "next/router";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

const contentStyle = {
  zIndex: 3,
  backgroundColor: "var(--b1)",
  margin: "0px",
  padding: "0px",
};

const containerStyle = {
  width: "100%",
  height: "100vh",
};

export default class Layout extends Component {
  state = {
    isSidebarOpen: false,
    internalPages: [
      {
        href: "/index",
        label: "HOME",
      },
      {
        label: "SHOWCASE",
        iconClasses: "",
        subPages: [
          {
            href: "/showcase/software",
            label: "SOFTWARE",
            iconClasses: "",
          },
          {
            href: "/showcase/photo",
            label: "PHOTO",
            iconClasses: "",
          },
          {
            href: "/showcase/video",
            label: "VIDEO",
            iconClasses: "",
          },
        ],
      },
      {
        href: "/blog",
        label: "BLOG",
        iconClasses: "",
      },
      {
        href: "/contact",
        label: "CONTACT",
        iconClasses: "",
      },
    ],
    externalPages: this.getExternalPages(),
  };

  handleToggleSidebar(openStatus) {
    this.setState({ isSidebarOpen: openStatus });
  }

  componentDidMount() {
    if (this.props.user) {
      this.addUserPages(this.props.user);
    }
  }

  addUserPages(user) {
    const newInternalPages = this.state.internalPages.slice();
    newInternalPages.unshift({
      label: user.username.toUpperCase(),
      iconClasses: "",
      subPages: [
        {
          href: "/profile",
          label: "PROFILE",
          iconClasses: "",
        },
        {
          label: "LOGOUT",
          iconClasses: "",
          onClick: async () => {
            try {
              await logoutAsync();
              window.localStorage.setItem("logout", Date.now());
              console.log("test");
              Router.push("/login");
            } catch (ex) {
              console.log(ex);
            }
          },
        },
      ],
    });

    this.setState({ internalPages: newInternalPages });
  }

  getExternalPages() {
    const { general } = this.props;
    let externalPages = [];

    if (!general) return externalPages;

    if (general.socialLinks.instagram)
      externalPages.push({
        href: general.socialLinks.instagram,
        iconClasses: "fab fa-instagram",
        label: "Instagram",
      });

    if (general.socialLinks.github)
      externalPages.push({
        href: general.socialLinks.github,
        iconClasses: "fab fa-github",
        label: "Github",
      });

    if (general.socialLinks.linkedin)
      externalPages.push({
        href: general.socialLinks.linkedin,
        iconClasses: "fab fa-linkedin-in",
        label: "LinkedIn",
      });

    return externalPages;
  }

  render() {
    const { children, general, user } = this.props;
    const { isSidebarOpen, internalPages, externalPages } = this.state;

    let title = general ? general.title : "SHOWCASE";
    let footnote = general ? general.footnote : "";

    return (
      <Theme variables={Theme.Light}>
        <div style={containerStyle}>
          <div className={layout.background} />
          <Sidebar
            user={user}
            onSetSidebarOpen={(openStatus) => this.handleToggleSidebar(openStatus)}
            isSidebarOpen={isSidebarOpen}
            internalPages={internalPages}
            externalPages={externalPages}
          />
          <Dimmer on={isSidebarOpen} />
          <div className={layout.layoutStyle}>
            <NamePlate user={user} title={title} />
            <Header user={user} internalPages={internalPages} externalPages={externalPages} />
            <div style={contentStyle}>{children}</div>
            <Footer externalPages={externalPages} footnote={footnote} />
          </div>
        </div>
      </Theme>
    );
  }
}
