import sidebar from "../styles/sidebar.module.css";
import { Component } from "react";
import Link from "next/link";

export default class Sidebar extends Component {
  state = {
    expanded: false
  };

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
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleGlobalClick);
  }

  handleGlobalClick(event) {
    if (this.sidebar && !this.sidebar.contains(event.target)) {
      this.setState({ expanded: false });
    }
  }

  handleToggleExpanded() {
    this.setState({ expanded: !this.state.expanded });
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
      paddingLeft: "10px"
    };

    const externalPageListItemStyle = {
      marginLeft: "5px",
      display: "inline"
    };

    const externalPageIconStyle = {
      fontSize: "30px"
    };

    const { expanded } = this.state;
    const { internalPages, externalPages } = this.props;

    const sidebarClass = expanded ? sidebar.sidebarExpanded : sidebar.sidebarCollapsed;
    return (
      <div className={sidebar.container}>
        {/* Floating Sidebar Toggle Button */}
        <button className={sidebar.menuButton} onClick={() => this.handleToggleExpanded(!expanded)}>
          menu
        </button>

        {/* Actual Sidebar*/}
        <div ref={this.setSidebarRef} className={sidebar.sidebar + " " + sidebarClass}>
          {/* Menu Button for closing*/}
          <button className={sidebar.menuButton} onClick={() => this.handleToggleExpanded(!expanded)}>
            menu
          </button>

          {/* Internal Links*/}
          <ul style={internalPageListStyle}>
            {internalPages.map(item => (
              <li style={internalPageListItemStyle} key={item.label}>
                <Link href={item.href}>
                  <a>
                    <button className="textButton">{item.label}</button>
                    <hr style={lineStyle}></hr>
                  </a>
                </Link>
              </li>
            ))}
          </ul>

          <ul style={externalPageListStyle}>
            {externalPages.map(item => (
              <li style={externalPageListItemStyle} key={item.label}>
                <a href={item.href}>
                  <i style={externalPageIconStyle} className={item.iconClasses}></i>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
