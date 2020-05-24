import paginationStyles from "../../styles/pagination.module.css";
import TransparentButton from "./transparentButton";
import Link from "next/link";
import { useRouter } from "next/router";

const getPaginationIndexArray = (start, current, end) => {
  let rangedArray = [];

  rangedArray.push(current);
  let adjacentPagesRequested = 4;
  let adjacentPagePushedCount = 0;
  for (let i = 1; i < adjacentPagesRequested + 1 && adjacentPagePushedCount < adjacentPagesRequested; i++) {
    let beforeCurrent = current - i;
    if (beforeCurrent >= start) {
      rangedArray.unshift(beforeCurrent);
      adjacentPagePushedCount += 1;
    }

    let afterCurrent = current + i;
    if (afterCurrent <= end) {
      rangedArray.push(afterCurrent);
      adjacentPagePushedCount += 1;
    }
  }

  return rangedArray;
};

export default function Pagination({ itemsCount, pageSize, currentPage }) {
  const router = useRouter();
  const pagesCount = Math.ceil(itemsCount / pageSize);
  const pages = getPaginationIndexArray(1, currentPage, pagesCount);
  if (pages <= 1) {
    return null;
  }

  console.log(itemsCount, pageSize, currentPage);

  let paginationButtonClasses = paginationStyles.paginationButton + " ";

  return (
    <nav className={paginationStyles.nav} aria-label="...">
      <ul className={paginationStyles.pagination}>
        <li key="first" className={paginationStyles.paginationItem}>
          <Link href={{ pathname: router.pathname, query: { ...router.query, page: 1 } }}>
            <a>
              <TransparentButton disabled={currentPage === 1} className={paginationButtonClasses}>
                First
              </TransparentButton>
            </a>
          </Link>
        </li>
        {(currentPage - 1) * pageSize <= itemsCount ? (
          pages.map((page) => (
            <li key={page} className={paginationStyles.paginationItem}>
              <Link href={{ pathname: router.pathname, query: { ...router.query, page: page } }}>
                <a>
                  <TransparentButton className={paginationButtonClasses + (currentPage === page ? paginationStyles.activePaginationButton : "")}>
                    {page}
                  </TransparentButton>
                </a>
              </Link>
            </li>
          ))
        ) : (
          <TransparentButton className={paginationButtonClasses + paginationStyles.activePaginationButton}>{currentPage}</TransparentButton>
        )}

        <li key="last" className={paginationStyles.paginationItem}>
          <Link href={{ pathname: router.pathname, query: { ...router.query, page: pagesCount } }}>
            <a>
              <TransparentButton disabled={currentPage === pagesCount} className={paginationButtonClasses}>
                Last
              </TransparentButton>
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
