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
    const listStyle = {
      marginTop: "70px",
      listStyleType: "none",
      paddingLeft: "10px"
    };

    const listItemStyle = {};

    const lineStyle = {
      marginRight: "10px",
      marginLeft: "5px",
      marginTop: "2px",
      marginBottom: "2px",
      color: "blue"
    };

    const { expanded } = this.state;
    const { pages } = this.props;

    const sidebarClass = expanded ? sidebar.sidebarExpanded : sidebar.sidebarCollapsed;
    return (
      <div className={sidebar.container}>
        {/* Floating Sidebar Toggle Button */}
        <button className={sidebar.menuButton} onClick={() => this.handleToggleExpanded(!expanded)}>
          menu
        </button>

        {/* Actual Sidebar*/}
        <div ref={this.setSidebarRef} className={sidebar.sidebar + " " + sidebarClass}>
          <button className={sidebar.menuButton} onClick={() => this.handleToggleExpanded(!expanded)}>
            menu
          </button>
          <ul style={listStyle}>
            {pages.map(item => (
              <li style={listItemStyle} key={item.label}>
                <Link href={item.href}>
                  <a>
                    <button className="textButton">{item.label}</button>
                    <hr style={lineStyle}></hr>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
          {/* Exteneral Links: TODO TAKE IN AS PROPS AND USE LIST*/}
          <span style={{ fontSize: "30px", color: "Tomato" }}>
            <i className="fab fa-linkedin"></i>
          </span>
          <span style={{ fontSize: "30px", color: "Tomato" }}>
            <i className="fab fa-github"></i>
          </span>{" "}
          <span style={{ fontSize: "30px", color: "Tomato" }}>
            <i className="fab fa-instagram"></i>
          </span>
        </div>
      </div>
    );
  }
}
