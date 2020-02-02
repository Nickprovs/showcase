import Link from "next/link";
import header from "../styles/header.module.css";

const menuItemStyle = {
  display: "inline"
};

export default function Header(props) {
  console.log("pages", props.pages);

  return (
    <div className={header.header}>
      <ul>
        {props.pages.map(item => (
          <li style={menuItemStyle} key={item.label}>
            <Link href={item.href}>
              <a>{item.label}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
