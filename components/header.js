import Link from "next/link";
import Icon from "./common/icon";
import TransparentButton from "./common/transparentButton";
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

const buttonStyle = {
  width: "100px",
  height: "100%"
};

const buttonStyleSelected = {
  width: "100px",
  height: "100%",
  background: "orange"
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

  return (
    <div className={header.header}>
      {/* Internal Links*/}
      <div className={header.leftContent}>
        <ul style={menuStyle}>
          {internalPages.map(item => (
            <li style={menuItemStyle} key={item.label}>
              <Link href={item.href}>
                <a>
                  <button
                    style={
                      item.href === router.pathname || (router.pathname === "/" && item.href === "/index")
                        ? buttonStyleSelected
                        : buttonStyle
                    }
                  >
                    {item.label}
                  </button>
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
                <TransparentButton>
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
