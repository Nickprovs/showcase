import namePlate from "../styles/nameplate.module.css";
import RouterUtilities from "../util/routerUtilities";
export default function NamePlate(props) {
  return (
    <div className={namePlate.namePlateContainer}>
      <a>
        <button
          className={namePlate.namePlateButton}
          onClick={async () => await RouterUtilities.routeInternalWithDelayAsync("/index", 300)}
        >
          NICHOLAS PROVOST
        </button>
      </a>
    </div>
  );
}
