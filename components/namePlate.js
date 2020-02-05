import Link from "next/link";
import namePlate from "../styles/nameplate.module.css";
import StandardButton from "./common/standardButton";
import RouterUtilities from "../util/routerUtilities";
export default function NamePlate(props) {
  return (
    <div className={namePlate.namePlateContainer}>
      <a>
        <StandardButton
          onClick={async () => await RouterUtilities.routeInternalWithDelayAsync("/index", 300)}
          className={namePlate.namePlateButton}
        >
          NICHOLAS PROVOST
        </StandardButton>
      </a>
    </div>
  );
}
