import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faLightbulb as fasLightbulb } from "@fortawesome/free-solid-svg-icons";
import { faLightbulb as farLightbulb } from "@fortawesome/free-regular-svg-icons";
import TransparentButton from "../common/button/transparentButton";
import HeaderButton from "./headerButton";
import HeaderDropdown from "./headerDropdown";
import header from "../../styles/layout/header.module.css";
import { useRouter } from "next/router";

const menuStyle = {
  margin: "0px",
  padding: "0px",
  height: "100%",
};

const menuItemStyle = {
  display: "inline",
};

export default function Header(props) {
  const { user, internalPages, externalPages, onToggleTheme, darkModeOn } = props;

  const externalPageListStyle = {
    margin: "0px",
    display: "flex",
    listStyle: "none",
  };

  const externalPageListItemStyle = {
    paddingRight: "25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const router = useRouter();

  const getHeaderButtonSelected = (item, currentPathName) => {
    const isSelected = item.getIsSelectedBasedOnPathNameOverride
      ? item.getIsSelectedBasedOnPathNameOverride(currentPathName)
      : currentPathName.toLowerCase().includes(item.label.toLowerCase());
    return isSelected;
  };

  const renderHeaderItem = (item) => {
    if (item.subPages && Object.entries(item.subPages).length > 0) {
      return (
        <HeaderDropdown isSelected={getHeaderButtonSelected(item, router.pathname)} text={item.label}>
          {item.subPages.map((item) =>
            item.onClick ? (
              <button key={item.label} onClick={item.onClick}>
                {item.label}
              </button>
            ) : (
              <Link href={item.href} key={item.label}>
                <a>{item.label}</a>
              </Link>
            )
          )}
        </HeaderDropdown>
      );
    } else {
      return (
        <Link href={item.href}>
          <a>
            <HeaderButton isSelected={getHeaderButtonSelected(item, router.pathname)}>{item.label}</HeaderButton>
          </a>
        </Link>
      );
    }
  };

  return (
    <nav className={header.header}>
      {/* Internal Links*/}
      <div className={header.leftContent}>
        <ul style={menuStyle}>
          {internalPages.map((item) => (
            <li style={menuItemStyle} key={item.label}>
              {renderHeaderItem(item)}
            </li>
          ))}
        </ul>
      </div>

      {/* External Links*/}
      <div className={header.rightContent}>
        <ul style={externalPageListStyle}>
          {user && user.isAdmin && (
            <li style={externalPageListItemStyle} key="editGeneral">
              <Link href="/edit/general" key="editGeneral">
                <a>
                  <TransparentButton aria-label="Edit General" style={{ color: "var(--s1)" }}>
                    <FontAwesomeIcon size="2x" icon={faEdit} />
                  </TransparentButton>
                </a>
              </Link>
            </li>
          )}
          <li style={externalPageListItemStyle} key="themeToggle">
            <TransparentButton aria-label="Toggle Theme" onClick={() => onToggleTheme()} style={{ color: "var(--s1)" }}>
              <FontAwesomeIcon size="2x" icon={darkModeOn ? farLightbulb : fasLightbulb} />
            </TransparentButton>
          </li>
          {externalPages.map((item) => (
            <li style={externalPageListItemStyle} key={item.label}>
              <a rel="noopener" target="_blank" href={item.href}>
                <TransparentButton aria-label={item.label} style={{ color: "var(--s1)" }}>
                  <FontAwesomeIcon size="2x" icon={item.icon} />
                </TransparentButton>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
