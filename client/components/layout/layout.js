import { Component } from "react";
import NamePlate from "./namePlate";
import Header from "./header";
import Footer from "./footer";
import Sidebar from "./sidebar";
import Theme from "./theme";
import Dimmer from "./dimmer";
import layout from "../../styles/layout/layout.module.css";
import { logoutAsync } from "../../services/authService";
import Router from "next/router";
import { faInstagram, faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const contentStyle = {
  zIndex: 3,
  backgroundColor: "var(--b1)",
  margin: "0px",
  padding: "0px",
};

export default class Layout extends Component {
  state = {
    isSidebarOpen: false,
  };

  handleToggleSidebar(openStatus) {
    this.setState({ isSidebarOpen: openStatus });
  }

  getInternalPages() {
    const { user } = this.props;

    let internalPages = [
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
            href: "/showcase/media",
            label: "MEDIA",
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
    ];

    if (user) {
      internalPages.unshift({
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
    }

    return internalPages;
  }

  getExternalPages() {
    const { general } = this.props;
    let externalPages = [];

    if (!general) return externalPages;

    if (general.socialLinks.instagram)
      externalPages.push({
        href: general.socialLinks.instagram,
        icon: faInstagram,
        label: "Instagram",
      });

    if (general.socialLinks.github)
      externalPages.push({
        href: general.socialLinks.github,
        icon: faGithub,
        label: "Github",
      });

    if (general.socialLinks.linkedin)
      externalPages.push({
        href: general.socialLinks.linkedin,
        icon: faLinkedin,
        label: "LinkedIn",
      });

    return externalPages;
  }

  render() {
    const { children, general, user } = this.props;
    const { isSidebarOpen } = this.state;
    const internalPages = this.getInternalPages();
    const externalPages = this.getExternalPages();

    let title = general ? general.title : "SHOWCASE";
    let footnote = general ? general.footnote : "";

    return (
      <Theme variables={Theme.Light}>
        <div className={layout.containerStyle}>
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
