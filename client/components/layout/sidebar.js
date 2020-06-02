import { Component } from "react";
import Icon from "../common/misc/icon";
import TransparentButton from "../common/button/transparentButton";
import Link from "next/link";
import MenuButton from "./menuButton";
import RouterUtilities from "../../util/routerUtilities";
import sidebar from "../../styles/sidebar.module.css";

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
          <label style={{ padding: "5px" }} className="prominentLabel">
            {item.label}
          </label>
          {item.subPages.map((item) => (
            <button
              key={item.label}
              style={{ fontSize: "10pt", paddingLeft: "20px" }}
              onClick={item.onClick ? item.onClick : async () => await this.handleInternalLinkableThingClicked(item.href)}
              className="textButton"
            >
              {item.label}
            </button>
          ))}

          <hr className={sidebar.lineStyle}></hr>
        </a>
      );
    } else {
      return (
        <div>
          <a>
            <button style={{ padding: "5px" }} onClick={async () => await this.handleInternalLinkableThingClicked(item.href)} className="textButton">
              {item.label}
            </button>
          </a>
          <hr className={sidebar.lineStyle}></hr>
        </div>
      );
    }
  }

  render() {
    const internalPageListStyle = {
      listStyleType: "none",
      paddingLeft: "10px",
    };

    const internalPageListItemStyle = {};

    const externalPageListStyle = {
      marginLeft: "14px",
      marginTop: "14px",
      listStyleType: "none",
      paddingLeft: "0px",
    };

    const externalPageListItemStyle = {
      marginRight: "25px",
      display: "inline",
    };

    const { internalPages, externalPages, isSidebarOpen, user } = this.props;

    const sidebarClass = isSidebarOpen ? sidebar.sidebarExpanded : sidebar.sidebarCollapsed;
    return (
      <div className={sidebar.container}>
        {/* Actual Sidebar*/}
        <div ref={this.setSidebarRef} className={sidebar.sidebar + " " + sidebarClass}>
          {/* Sidebar Menu Button */}
          <MenuButton onClick={() => this.handleToggleExpanded(!isSidebarOpen)} />

          {/* Internal Links*/}
          <ul style={internalPageListStyle}>
            {internalPages.map((item) => (
              <li key={item.label} style={internalPageListItemStyle}>
                {this.renderInternalItem(item)}
              </li>
            ))}
          </ul>

          {/* External Links*/}
          <ul style={externalPageListStyle}>
            {user && user.isAdmin && (
              <li style={externalPageListItemStyle} key="editGeneral">
                <Link href="/edit/general" key="editGeneral">
                  <TransparentButton>
                    <Icon className="fas fa-edit"></Icon>
                  </TransparentButton>
                </Link>
              </li>
            )}
            {externalPages.map((item) => (
              <li key={item.label} style={externalPageListItemStyle}>
                <TransparentButton onClick={async () => await this.handleExternalLinkableThingClicked(item.href)}>
                  <Icon className={item.iconClasses}></Icon>
                </TransparentButton>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
