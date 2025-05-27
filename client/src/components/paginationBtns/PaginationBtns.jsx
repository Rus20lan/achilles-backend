import { useDispatch, useSelector } from 'react-redux';
import './style.scss';
import { setPage } from '../../redux/slices/dynamicPaginationSlice';
import { useContext, useEffect, useRef, useState } from 'react';
import Loader from '../loader/Loader';
import getVisiblePages from '../../services/getVisiblePages';
import { InstallerContext } from '../App/App';

const PaginationBtns = () => {
  const {
    installer: { theme },
  } = useContext(InstallerContext);
  const { page, totalPages, isLoading } = useSelector(
    (state) => state.dynamicPagination
  );
  const dispatch = useDispatch();

  const handlePageChange = (number) => {
    // Переход на новую страницу
    dispatch(setPage({ page: number }));
  };

  // console.log(`Page: ${page}, totalPages: ${totalPages}`);
  const pageNumbers = getVisiblePages(page, totalPages, 5, '...');

  if (isLoading) return <Loader />;

  return (
    <ul className="pagination">
      {pageNumbers.map((number, index) =>
        number === '...' ? (
          <li key={index} className="">
            <span>...</span>
          </li>
        ) : (
          <li
            key={index}
            className={`${
              Number(page) === +number
                ? `page_active ${theme}-theme__page_active`
                : ''
            } `}
          >
            <button
              className={`pagination__number ${theme}-theme__pagination__number`}
              onClick={() => handlePageChange(number)}
              disabled={Number(page) === +number && true}
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
