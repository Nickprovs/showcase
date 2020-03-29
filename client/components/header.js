import Link from "next/link";
import Icon from "./common/icon";
import TransparentButton from "./common/transparentButton";
import HeaderButton from "./headerButton";
import HeaderDropdown from "./headerDropdown";

import header from "../styles/header.module.css";
import { useRouter } from "next/router";

const menuStyle = {
  margin: "0px",
  padding: "0px",
  height: "100%"
};

const menuItemStyle = {
  display: "inline"
};

export default function Header(props) {
  const { internalPages, externalPages } = props;

  const externalPageListStyle = {
    listStyleType: "none"
  };

  const externalPageListItemStyle = {
    paddingRight: "25px",
    display: "inline"
  };

  const router = useRouter();

  const getHeaderButtonSelected = (item, currentPathName) => {
    return currentPathName.toLowerCase().includes(item.label.toLowerCase());
  };

  const renderHeaderItem = item => {
    if (item.subPages && Object.entries(item.subPages).length > 0) {
      return (
        <HeaderDropdown isSelected={getHeaderButtonSelected(item, router.pathname)} text={item.label}>
          {item.subPages.map(item => item.onClick ? <button onClick={item.onClick}>{item.label}</button> : (
            <Link href={item.href} key={item.label}>
              <a>{item.label}</a>
            </Link>
          ))}
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
          {internalPages.map(item => (
            <li style={menuItemStyle} key={item.label}>
              {renderHeaderItem(item)}
            </li>
          ))}
        </ul>
      </div>

      {/* External Links*/}
      <div className={header.rightContent}>
        <ul style={externalPageListStyle}>
          {externalPages.map(item => (
            <li style={externalPageListItemStyle} key={item.label}>
              <a href={item.href}>
                <TransparentButton style={{ color: "var(--s1)" }}>
                  <Icon className={item.iconClasses}></Icon>
                </TransparentButton>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
