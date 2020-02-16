import paginationStyles from "../../styles/pagination.module.css";
import TransparentButton from "./transparentButton";
import Link from "next/link";
import { useRouter } from "next/router";

const getRangedIntArray = (start, end) => {
  let rangedArray = [];
  for (let i = start; i < end; i++) rangedArray.push(i);

  return rangedArray;
};

export default function Pagination({ itemsCount, pageSize, currentPage }) {
  console.log("pagination", currentPage);

  const router = useRouter();
  console.log("currrrrent page", currentPage);

  const pagesCount = Math.ceil(itemsCount / pageSize);
  const pages = getRangedIntArray(1, pagesCount + 1);
  if (pages <= 1) {
    return null;
  }

  let paginationButtonClasses = paginationStyles.paginationButton + " ";

  return (
    <nav className={paginationStyles.nav} aria-label="...">
      <ul className={paginationStyles.pagination}>
        {pages.map(page => (
          <li key={page} className={paginationStyles.paginationItem}>
            <Link href={`${router.pathname}?page=${page}`}>
              <a>
                {console.log("current page", currentPage, "list page", page)}
                <TransparentButton
                  className={paginationButtonClasses + (currentPage === page ? paginationStyles.activePaginationButton : "")}
                >
                  {page}
                </TransparentButton>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
