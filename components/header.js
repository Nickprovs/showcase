import Link from "next/link";
import Icon from "./common/icon";
import TransparentButton from "./common/transparentButton";
import HeaderButton from "./headerButton";
import Dropdown from "./common/dropdown";

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
  console.log("router path", router.pathname);

  const getHeaderButtonSelected = (itemPathName, currenPathName) => {
    return itemPathName === currenPathName || (currenPathName === "/" && itemPathName === "/index");
  };

  return (
    <div className={header.header}>
      {/* Internal Links*/}
      <div className={header.leftContent}>
        <ul style={menuStyle}>
          {internalPages.map(item => (
            <li style={menuItemStyle} key={item.label}>
              <Link href={item.href}>
                <a>
                  <HeaderButton isSelected={getHeaderButtonSelected(item.href, router.pathname)}>{item.label}</HeaderButton>
                </a>
              </Link>
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

      <Dropdown text="SHOWCASE">
        <Link href={"/showcase/software"}>
          <a>SOFTWARE</a>
        </Link>
        <Link href={"/showcase/photo"}>
          <a>PHOTO</a>
        </Link>
        <Link href={"/showcase/video"}>
          <a>VIDEO</a>
        </Link>
      </Dropdown>
    </div>
  );
}
