import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import CardsList from "../components/cardsList/CardsList";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/loader/Loader";
import "../components/entityProfile/style.scss";
import SortBtns from "../components/sortBtns/SortBtns";
import CustomSelect from "../components/customSelect/CustomSelect";
import PaginationBtns from "../components/paginationBtns/PaginationBtns";
import {
  getFetchWithPagination,
  setPage,
} from "../redux/slices/dynamicPaginationSlice";

const entitys = [
  { index: 1, name: "Титула", entity: "title", url: "/api/titles" },
  { index: 2, name: "Документация", entity: "design", url: "/api/designs" },
  { index: 3, name: "Ресурсы", entity: "resource", url: "/api/resources" },
  { index: 4, name: "Факт", entity: "fact", url: "/api/facts" },
];

export const MainAppContainer = styled.div`
  max-width: 1180px;
  width: 95%;
  margin: 0 auto;
`;

export const LimitSelectWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  p {
    margin: 0;
    font-size: 1em;
    font-weight: 700;
    color: #21005d;
  }
  @media (max-width: 424px) {
    p {
      font-size: 0.8em;
    }
  }
`;

const MainPage = () => {
  // Состояние для новой главной странице
  const { limit, page, isLoading } = useSelector(
    (state) => state.dynamicPagination
  );
  const [sort, setSort] = useState(1);
  // Используем redux toolkit
  const dispatch = useDispatch();

  //  Константа для сохранения текущей ветки страницы
  const currentIndex = useMemo(() => {
    // При изменении вкладки отображения будем сбрасывать page на 1 страницу
    // dispatch(setPage(1));
    return entitys?.findIndex((enti) => enti.index === sort);
  }, [sort]);

  // const fetchParams = useMemo(
  //   () => ({ url: entitys[currentIndex].url, limit, page }),
  //   [currentIndex, limit, page]
  // );

  useEffect(() => {
    if (currentIndex === -1) return;
    // Загрузка данных с помощью dynamicPagination
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        await dispatch(
          getFetchWithPagination({
            url: entitys[currentIndex].url,
            limit,
            page,
            signal: controller.signal,
          })
        );
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Ошибка загрузки:", error);
        }
      }
    };
    fetchData();
    return () => controller.abort();
    // dispatch(getFetchWithPagination(fetchParams));
  }, [currentIndex, limit, page]);

  return (
    <>
      <MainAppContainer>
        {isLoading ? (
          <Loader />
        ) : (
          <ViewMain sort={sort} setSort={setSort} isGridContainer={true} />
        )}
      </MainAppContainer>
    </>
  );
};

const ViewMain = ({ setSort, sort, onChange }) => {
  const {
    data,
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage,
    hasPrevPage,
  } = useSelector((state) => state.dynamicPagination);
  // console.log(data);
  // console.log("MainPage");
  return (
    <div className="entity_container">
      <div className="entity_section">
        {/* <h1>Это главная страница программы</h1> */}
        <SortBtns onChangeSort={setSort} activeSort={sort} arrSort={entitys} />
        <LimitSelectWrapper>
          <p>Лимит</p>
          <CustomSelect limit={limit} />
        </LimitSelectWrapper>
      </div>
      <div className="separator"></div>
      <div className="entity_section">
        <CardsList cardsList={data} isGridContainer={false} />
      </div>
      <div className="section">
        <PaginationBtns />
      </div>
    </div>
  );
};

// onChange={onChange}

const View = ({ titles }) => {
  return (
    <>
      <h1>Выберите объект для внесения факта</h1>
      <CardsList cardsList={titles} entity={"title"} isGridContainer={true} />
    </>
  );
};

export default MainPage;
