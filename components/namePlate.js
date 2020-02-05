import Link from "next/link";
import namePlate from "../styles/nameplate.module.css";
import StandardButton from "./common/standardButton";

export default function NamePlate(props) {
  console.log("in name plate", namePlate.namePlateButton);

  return (
    <div className={namePlate.namePlateContainer}>
      <Link href="/index">
        <a>
          <StandardButton className={namePlate.namePlateButton}>NICHOLAS PROVOST</StandardButton>
        </a>
      </Link>
    </div>
  );
}
