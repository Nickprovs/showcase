import sidebar from "../styles/sidebar.module.css";
import { useState } from "react";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  const sidebarClass = expanded ? sidebar.sidebarExpanded : sidebar.sidebarCollapsed;
  console.log(sidebarClass);
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
        <p>sidebar</p>
      </div>
    </div>
  );
}
