import { Component, Children, isValidElement, cloneElement } from "react";
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
import { facResume } from "../../misc/customFontAwesomeIcons";
import ThemeUtilities from "../../util/themeUtilities";

const contentStyle = {
  zIndex: 3,
  backgroundColor: "var(--b1)",
  margin: "0px",
  padding: "0px",
};



export default class Layout extends Component {
  state = {
    isSidebarOpen: false,
    darkModeOn: this.props.darkModeOn ? this.props.darkModeOn : false,
  };

  componentDidMount() {
    this.setState({ darkModeOn: ThemeUtilities.getSavedDarkModeOnStatus() });
  }

  handleToggleSidebar(openStatus) {
    this.setState({ isSidebarOpen: openStatus });
  }

  getInternalPages() {
    const { user, general } = this.props;
    
    let showcaseSubPages = [
      {
        href: "/photo",
        label: "PHOTO",
        iconClasses: "",
      },
      {
        href: "/media",
        label: "MEDIA",
        iconClasses: "",
      },
    ];

    let internalPages = [
      {
        href: "/index",
        label: "HOME",
        getIsSelectedBasedOnPathNameOverride: (pathname) => {
          return pathname.toLowerCase() === "/" || pathname.toLowerCase() === "/index";
        },
      },
      {
        label: "SHOWCASE",
        iconClasses: "",
        subPages: showcaseSubPages,
        getIsSelectedBasedOnPathNameOverride: (pathname) => {
          return pathname && pathname !== "/" && showcaseSubPages.some((s) => s.href.toLowerCase().startsWith(pathname.toLowerCase()));
        },
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

    if (general && general.portfolio.show) {
      showcaseSubPages.unshift({
        href: "/portfolio",
        label: general ? general.portfolio.title.toUpperCase() : "PORTFOLIO",
        iconClasses: "",
      });
    }

    if (user) {
      internalPages.unshift({
        label: user.username.toUpperCase(),
        iconClasses: "",
        getIsSelectedBasedOnPathNameOverride: (pathname) => {
          return pathname.toLowerCase().includes("/user");
        },
        subPages: [
          {
            href: "/user/profile",
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
                Router.reload();
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

    if (general.links.instagram)
      externalPages.push({
        href: general.links.instagram,
        icon: faInstagram,
        label: "Instagram",
      });

      if (general.links.github)
      externalPages.push({
        href: general.links.github,
        icon: faGithub,
        label: "Github",
      });
      if (general.links.linkedin)
      externalPages.push({
        href: general.links.linkedin,
        icon: faLinkedin,
        label: "LinkedIn",
      });

      if (general.links.resume)
      externalPages.push({
        href: general.links.resume,
        icon: facResume,
        label: "Resume",
      });

    return externalPages;
  }

  handleToggleTheme() {
    const darkModeOn = !this.state.darkModeOn;
    this.setState({ darkModeOn });
    ThemeUtilities.saveDarkModeOnStatus(darkModeOn);
  }

  render() {
    const { children, general, user } = this.props;
    const { isSidebarOpen, darkModeOn } = this.state;
    const internalPages = this.getInternalPages();
    const externalPages = this.getExternalPages();

    const childrenWithProps = Children.map(children, (child) => {
      if (isValidElement(child)) {
        return cloneElement(child, { darkModeOn });
      }
    });

    let title = general ? general.title : "SHOWCASE";
    let footnote = general ? general.footnote : "";

    const theme = darkModeOn ? Theme.Dark : Theme.Light;

    //Get background image based on theme -- with a fallback of a non-themed background image.
    const backgroundImageCssUrl = darkModeOn ? `url("/images/background-dark.jpg")` : `url("/images/background-light.jpg")`;

    return (
      <Theme variables={theme}>
        <div className={layout.containerStyle}>
          <div style={{ backgroundImage: backgroundImageCssUrl }} className={layout.background} />
          <Sidebar
            user={user}
            onSetSidebarOpen={(openStatus) => this.handleToggleSidebar(openStatus)}
            isSidebarOpen={isSidebarOpen}
            internalPages={internalPages}
            externalPages={externalPages}
            darkModeOn={darkModeOn}
            onToggleTheme={() => this.handleToggleTheme()}
          />
          <Dimmer on={isSidebarOpen} />
          <div className={layout.layoutStyle}>
            <NamePlate user={user} title={title} />
            <Header
              user={user}
              internalPages={internalPages}
              externalPages={externalPages}
              darkModeOn={darkModeOn}
              onToggleTheme={() => this.handleToggleTheme()}
            />
            <main style={contentStyle}>{childrenWithProps}</main>
            <Footer externalPages={externalPages} footnote={footnote} darkModeOn={darkModeOn} onToggleTheme={() => this.handleToggleTheme()} />
          </div>
        </div>
      </Theme>
    );
  }
}
