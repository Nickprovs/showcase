import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
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
  const { internalPages, externalPages, user } = props;

  const externalPageListStyle = {
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
    <div className={header.header}>
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
                <TransparentButton style={{ color: "var(--s1)" }}>
                  <FontAwesomeIcon size="2x" icon={faEdit} />
                </TransparentButton>
              </Link>
            </li>
          )}
          {externalPages.map((item) => (
            <li style={externalPageListItemStyle} key={item.label}>
              <a href={item.href}>
                <TransparentButton style={{ color: "var(--s1)" }}>
                  <FontAwesomeIcon size="2x" icon={item.icon} />
                </TransparentButton>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
