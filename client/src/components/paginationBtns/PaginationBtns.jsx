import { useDispatch, useSelector } from "react-redux";
import "./style.scss";
import { setPage } from "../../redux/slices/dynamicPaginationSlice";
import { useEffect, useRef, useState } from "react";

const PaginationBtns = () => {
  const scrollPosition = useRef(0);
  const [isPageChanging, setIsPageChanging] = useState(false);
  const { page, totalPages, isLoading } = useSelector(
    (state) => state.dynamicPagination
  );
  const dispatch = useDispatch();

  const handlePageChange = (number) => {
    if (page === number) return;
    // Сохраняем позицию и флаг изменения
    scrollPosition.current = window.scrollY;
    setIsPageChanging(true);

    // Переход на новую страницу
    dispatch(setPage({ page: number }));
  };

  useEffect(() => {
    if (!isPageChanging || isLoading) return;
    // console.log(scrollPosition);
    const checkAndRestoreScroll = () => {
      const contentMarker = document.querySelector("#cards_container_line");
      const isContentReady = contentMarker && contentMarker.offsetHeight > 0;
      if (isContentReady) {
        window.scrollTo({ top: scrollPosition.current, behavior: "instant" });
        setIsPageChanging(false);
        console.log(scrollPosition);
        // const scrollRestoration = () => {
        //   window.scrollTo({
        //     top: scrollPosition.current,
        //     behavior: "auto",
        //   });
        //   scrollPosition.current = 0;
        // };
        // requestAnimationFrame(scrollRestoration);

        // scrollPosition.current = 0;
      }
    };
    checkAndRestoreScroll();
    return () => {
      setIsPageChanging(false);
    };
  }, [isLoading, isPageChanging]);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Максимальное количество номеров страниц для показа
    // Всегда добавляем 2 страницы
    for (let i = 1; i <= Math.min(2, totalPages); i++) {
      pages.push(i);
    }

    const startMiddle = Math.max(page - 1, 3);
    const endMiddle = Math.min(page + 1, totalPages - 2);

    if (startMiddle > 3) {
      pages.push("...");
    }

    for (let i = startMiddle; i <= endMiddle; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (endMiddle < totalPages - 2) {
      pages.push("...");
    }

    for (let i = Math.max(totalPages - 1, 3); i <= totalPages; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <ul className="pagination">
      {pageNumbers.map((number, index) =>
        number === "..." ? (
          <li key={index}>
            <span>...</span>
          </li>
        ) : (
          <li key={index} className={page === number ? "page_active" : ""}>
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
