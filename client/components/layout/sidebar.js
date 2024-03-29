import { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faLightbulb as fasLightbulb } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb as farLightbulb } from "@fortawesome/free-regular-svg-icons";
import TransparentButton from "../common/button/transparentButton";
import Link from "next/link";
import MenuButton from "./menuButton";
import RouterUtilities from "../../util/routerUtilities";
import sidebarStyles from "../../styles/layout/sidebar.module.css";

export default class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.handleGlobalClick = this.handleGlobalClick.bind(this);
    this.handleToggleExpanded = this.handleToggleExpanded.bind(this);

    this.sidebar = null;
    this.setSidebarRef = (element) => {
      this.sidebar = element;
    };
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleGlobalClick);
    window.addEventListener("resize", this.handleWindowResise.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleGlobalClick);
    window.removeEventListener("resize", this.handleWindowResise.bind(this));
  }

  handleWindowResise(event) {
    if (window.innerWidth > 950) this.props.onSetSidebarOpen(false);
  }

  handleGlobalClick(event) {
    if (this.sidebar && !this.sidebar.contains(event.target)) {
      this.props.onSetSidebarOpen(false);
    }
  }

  handleToggleExpanded() {
    const isSidebarOpen = this.props.isSidebarOpen;
    this.props.onSetSidebarOpen(!isSidebarOpen);
  }

  async handleInternalLinkableThingClicked(url) {
    this.props.onSetSidebarOpen(false);
    await RouterUtilities.routeInternalWithDelayAsync(url, 300);
  }

  async handleExternalLinkableThingClicked(url) {
    this.props.onSetSidebarOpen(false);
    await RouterUtilities.routeExternalWithDelayAsync(url, "_newtab", 300);
  }

  renderInternalItem(item) {
    if (item.subPages && Object.entries(item.subPages).length > 0) {
      return (
        <a>
          <label className={sidebarStyles.prominentLabel}>{item.label}</label>
          {item.subPages.map((item) => (
            <button
              key={item.label}
              style={{ fontSize: "10pt", paddingLeft: "20px" }}
              onClick={item.onClick ? item.onClick : async () => await this.handleInternalLinkableThingClicked(item.href)}
              className={sidebarStyles.textButton}
            >
              {item.label}
            </button>
          ))}

          <hr className={sidebarStyles.lineStyle}></hr>
        </a>
      );
    } else {
      return (
        <div>
          <a>
            <button style={{ padding: "5px" }} onClick={async () => await this.handleInternalLinkableThingClicked(item.href)} className={sidebarStyles.textButton}>
              {item.label}
            </button>
          </a>
          <hr className={sidebarStyles.lineStyle}></hr>
        </div>
      );
    }
  }

  render() {
    const { user, internalPages, externalPages, isSidebarOpen, onSetSidebarOpen, onToggleTheme, darkModeOn } = this.props;
    const sidebarClass = isSidebarOpen ? sidebarStyles.sidebarExpanded : sidebarStyles.sidebarCollapsed;
    
    return (
      <nav className={sidebarStyles.container}>
        {/* Actual Sidebar*/}
        <div ref={this.setSidebarRef} className={sidebarStyles.sidebar + " " + sidebarClass}>
          {/* Sidebar Menu Button */}
          <MenuButton onClick={() => this.handleToggleExpanded(!isSidebarOpen)} />

          {/* Internal Links*/}
          <ul className={sidebarStyles.internalPageList}>
            {internalPages.map((item) => (
              <li key={item.label}>
                {this.renderInternalItem(item)}
              </li>
            ))}
          </ul>

          {/* External Links*/}
          <ul className={sidebarStyles.externalPageList}>
            {user && user.isAdmin && (
              <li className={sidebarStyles.externalPageListItem} key="editGeneral">
                <Link href="/edit/general" key="editGeneral">
                  <TransparentButton aria-label="Edit General">
                    <FontAwesomeIcon size="2x" icon={faEdit} />
                  </TransparentButton>
                </Link>
              </li>
            )}
            <li className={sidebarStyles.externalPageListItem} key="themeToggle">
              <TransparentButton
                aria-label="Toggle Theme"
                onClick={() => {
                  onToggleTheme();
                  onSetSidebarOpen(false);
                }}
              >
                <FontAwesomeIcon size="2x" icon={darkModeOn ? farLightbulb : fasLightbulb} />
              </TransparentButton>
            </li>
            {externalPages.map((item) => (
              <li key={item.label} className={sidebarStyles.externalPageListItem}>
                <TransparentButton aria-label={item.label} onClick={async () => await this.handleExternalLinkableThingClicked(item.href)}>
                  <FontAwesomeIcon size="2x" icon={item.icon} />
                </TransparentButton>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    );
  }
}
