import namePlate from "../../styles/layout/nameplate.module.css";
import RouterUtilities from "../../util/routerUtilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import TransparentButton from "../common/button/transparentButton";
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
          <a>
            <TransparentButton style={{ color: "var(--s1)" }}>
              <FontAwesomeIcon size="2x" icon={faEdit} />
            </TransparentButton>
          </a>
        </Link>
      )}
    </div>
  );
}
