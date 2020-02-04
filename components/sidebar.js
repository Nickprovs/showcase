import sidebar from "../styles/sidebar.module.css";
import { useState } from "react";
import Link from "next/link";

export default function Sidebar(props) {
  const [expanded, setExpanded] = useState(false);

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

  const sidebarClass = expanded ? sidebar.sidebarExpanded : sidebar.sidebarCollapsed;
  return (
    <div className={sidebar.container}>
      {/* Floating Sidebar Toggle Button */}
      <button className={sidebar.menuButton} onClick={() => setExpanded(!expanded)}>
        menu
      </button>

      {/* Actual Sidebar*/}
      <div className={sidebar.sidebar + " " + sidebarClass}>
        <button className={sidebar.menuButton} onClick={() => setExpanded(!expanded)}>
          menu
        </button>
        <ul style={listStyle}>
          {props.pages.map(item => (
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
      </div>
    </div>
  );
}
