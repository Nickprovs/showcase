import sidebar from "../styles/sidebar.module.css";
import { useState } from "react";
import Link from "next/link";

export default function Sidebar(props) {
  const [expanded, setExpanded] = useState(false);

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
        <ul>
          {props.pages.map(item => (
            <li key={item.label}>
              <Link href={item.href}>
                <a>{item.label}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
