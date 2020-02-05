import Link from "next/link";
import namePlate from "../styles/nameplate.module.css";
import StandardButton from "./common/standardButton";

export default function NamePlate(props) {
  return (
    <div className={namePlate.namePlateContainer}>
      <Link href="/index">
        <a>
          <StandardButton style={{ width: "300px", height: "70px" }}>Nicholas Provost</StandardButton>
        </a>
      </Link>
    </div>
  );
}
