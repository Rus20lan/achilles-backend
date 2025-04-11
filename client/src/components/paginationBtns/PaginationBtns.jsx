import { useDispatch, useSelector } from "react-redux";
import "./style.scss";
import { setPage } from "../../redux/slices/dynamicPaginationSlice";
import { useEffect, useRef, useState } from "react";
import Loader from "../loader/Loader";
import getVisiblePages from "../../services/getVisiblePages";

const PaginationBtns = () => {
  const scrollPosition = useRef(0);
  const { page, totalPages, isLoading } = useSelector(
    (state) => state.dynamicPagination
  );
  const dispatch = useDispatch();

  const handlePageChange = (number) => {
    // Переход на новую страницу
    dispatch(setPage({ page: number }));
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Максимальное количество номеров страниц для показа
    // Первая реализация. Всегда добавляем 2 страницы
    // for (let i = 1; i <= Math.min(2, totalPages); i++) {
    //   pages.push(i);
    // }

    // const startMiddle = Math.max(page - 1, 3);
    // const endMiddle = Math.min(page + 1, totalPages - 2);

    // if (startMiddle > 3) {
    //   pages.push("...");
    // }

    // for (let i = startMiddle; i <= endMiddle; i++) {
    //   if (!pages.includes(i)) {
    //     pages.push(i);
    //   }
    // }

    // if (endMiddle < totalPages - 2) {
    //   pages.push("...");
    // }

    // for (let i = Math.max(totalPages - 1, 3); i <= totalPages; i++) {
    //   if (!pages.includes(i)) {
    //     pages.push(i);
    //   }
    // }

    const halfWindwow = 2;

    pages.push(1);
    let startMiddle = Math.max(2, page - halfWindwow);
    let endMiddle = Math.min(totalPages - 1, page + halfWindwow);

    if (startMiddle > 2) {
      pages.push("...");
    }

    for (let i = startMiddle; i <= endMiddle; i++) {
      pages.push(i);
    }

    if (endMiddle < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages !== 1) {
      pages.push(totalPages);
    }

    if (pages.length > maxVisible) {
      const currentIndex = pages.indexOf(page);
      const startKeep = Math.max(1, currentIndex - halfWindwow);
      const endKeep = Math.min(pages.length - 1, currentIndex + halfWindwow);

      return [
        pages[0],
        ...(startKeep > 1 ? ["..."] : []),
        ...pages.slice(startKeep, endKeep + 1),
        // .filter((p) => p !== "..." || p === "..."),
        ...(endKeep < pages.length - 2 ? ["..."] : []),
        pages[pages.length - 1],
      ].slice(0, maxVisible);
    }

    return pages;
  };

  // const pageNumbers = getPageNumbers();
  console.log(`Page: ${page}, totalPages: ${totalPages}`);
  const pageNumbers = getVisiblePages(page, totalPages, 5, "...");

  if (isLoading) return <Loader />;

  return (
    <ul className="pagination">
      {pageNumbers.map((number, index) =>
        number === "..." ? (
          <li key={index}>
            <span>...</span>
          </li>
        ) : (
          <li
            key={index}
            className={`${Number(page) === +number ? "page_active" : "s"}`}
          >
            <button
              className="pagination__number"
              onClick={() => handlePageChange(number)}
            >
              {number}
            </button>
          </li>
        )
      )}
    </ul>
  );
};

export default PaginationBtns;
