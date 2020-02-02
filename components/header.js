import Link from "next/link";
import header from "../styles/header.module.css";

const linkStyle = {
  marginRight: 15
};

export default function Header() {
  return (
    <div className={header.header}>
      <Link href="/">
        <a style={linkStyle}>Home</a>
      </Link>
    </div>
  );
}
