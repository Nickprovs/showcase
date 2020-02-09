import { Component } from "react";
import Icon from "./common/icon";
import TransparentButton from "./common/transparentButton";
import MenuButton from "./menuButton";
import RouterUtilities from "../util/routerUtilities";
import sidebar from "../styles/sidebar.module.css";

export default class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.handleGlobalClick = this.handleGlobalClick.bind(this);
    this.handleToggleExpanded = this.handleToggleExpanded.bind(this);

    this.sidebar = null;
    this.setSidebarRef = element => {
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

  render() {
    const internalPageListStyle = {
      marginTop: "70px",
      listStyleType: "none",
      paddingLeft: "10px"
    };

    const internalPageListItemStyle = {};

    const lineStyle = {
      marginRight: "10px",
      marginLeft: "5px",
      marginTop: "2px",
      marginBottom: "2px",
      color: "blue"
    };

    const externalPageListStyle = {
      marginTop: "40px",
      listStyleType: "none",
      paddingLeft: "0px"
    };

    const externalPageListItemStyle = {
      marginLeft: "25px",
      display: "inline"
    };

    const { internalPages, externalPages, isSidebarOpen } = this.props;

    const sidebarClass = isSidebarOpen ? sidebar.sidebarExpanded : sidebar.sidebarCollapsed;
    return (
      <div className={sidebar.container}>
        {/* Actual Sidebar*/}
        <div ref={this.setSidebarRef} className={sidebar.sidebar + " " + sidebarClass}>
          {/* Sidebar Menu Button */}
          <MenuButton onClick={() => this.handleToggleExpanded(!isSidebarOpen)} />

          {/* Internal Links*/}
          <ul style={internalPageListStyle}>
            {internalPages.map(item => (
              <li style={internalPageListItemStyle} key={item.label}>
                <a>
                  <button onClick={async () => await this.handleInternalLinkableThingClicked(item.href)} className="textButton">
                    {item.label}
                  </button>
                  <hr style={lineStyle}></hr>
                </a>
              </li>
            ))}
          </ul>

          {/* External Links*/}
          <ul style={externalPageListStyle}>
            {externalPages.map(item => (
              <li style={externalPageListItemStyle} key={item.label}>
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
