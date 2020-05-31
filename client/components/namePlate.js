import namePlate from "../styles/nameplate.module.css";
import RouterUtilities from "../util/routerUtilities";
import Icon from "./common/icon";
import TransparentButton from "./common/button/transparentButton";
import Link from "next/link";

export default function NamePlate(props) {
  let title = props.title ? props.title : "PLACEHOLDER";
  let user = props.user;
  return (
    <div className={namePlate.namePlateContainer}>
      <a>
        <button className={namePlate.namePlateButton} onClick={async () => await RouterUtilities.routeInternalWithDelayAsync("/index", 300)}>
          {title}
        </button>
      </a>
      {user && user.isAdmin && (
        <Link href="/edit/general" key="editGeneral">
          <TransparentButton style={{ color: "var(--s1)" }}>
            <Icon className="fas fa-edit"></Icon>
          </TransparentButton>
        </Link>
      )}
    </div>
  );
}
