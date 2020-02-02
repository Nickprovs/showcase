import Link from "next/link";
import header from "../styles/header.module.css";

export default function Header() {
  return (
    <div className={header.header}>
      <label>Home</label>
    </div>
  );
}
