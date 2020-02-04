import Link from "next/link";
import header from "../styles/header.module.css";

const menuStyle = {
  marginLeft: "0px",
  padding: "0px",
  height: "100%"
};

const menuItemStyle = {
  display: "inline",
  height: "100%"
};

const buttonStyle = {
  width: "100px",
  height: "100%"
};

export default function Header(props) {
  const { internalPages, externalPages } = props;
  return (
    <div className={header.header}>
      <ul style={menuStyle}>
        {internalPages.map(item => (
          <li style={menuItemStyle} key={item.label}>
            <Link href={item.href}>
              <a>
                <button style={buttonStyle}>{item.label}</button>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
