import { useEffect, useMemo, useState } from "react";
import PostgresApi from "../services/PostgresApi";
import styled from "styled-components";
import CardsList from "../components/cardsList/CardsList";
import { useSelector } from "react-redux";
import Loader from "../components/loader/Loader";
import "../components/entityProfile/style.scss";
import SortBtns from "../components/sortBtns/SortBtns";
import Card from "../components/card/Card";

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

const MainPage = () => {
  // Состояние для новой главной странице
  const [sort, setSort] = useState(1);

  const postgresApi = new PostgresApi();
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  //  Константа для сохранения текущей ветки страницы
  const currentIndex = useMemo(() => {
    return entitys?.findIndex((enti) => enti.index === sort);
  }, [sort]);

  useEffect(() => {
    postgresApi.getEntity(entitys[currentIndex].url).then((res) => {
      setData([...res.data]);
    });
  }, [currentIndex]);

  // useEffect(() => {
  //   postgresApi.getEntity("/api/titles").then((res) => {
  //     setTitles([...res.data]);
  //   });
  // }, [sort]);

  // useEffect(() => {
  //   if (titles.length > 0) {
  //     setLoading(false);
  //   } else {
  //     setLoading(true);
  //   }
  // }, [titles]);

  return (
    <>
      <MainAppContainer>
        {/* {loading ? <Loader /> : <View titles={titles} />} */}
        {loading ? (
          <Loader />
        ) : (
          <ViewMain
            sort={sort}
            setSort={setSort}
            data={data}
            isGridContainer={true}
          />
        )}
      </MainAppContainer>
    </>
  );
};

const View = ({ titles }) => {
  return (
    <>
      <h1>Выберите объект для внесения факта</h1>
      <CardsList cardsList={titles} entity={"title"} isGridContainer={true} />
    </>
  );
};

const ViewMain = ({ sort, setSort, data }) => {
  // const currentIndex = entitys.findIndex((enti) => enti.index === sort);
  console.log(data);
  return (
    <div className="entity_container">
      <div className="entity_section">
        {/* <h1>Это главная страница программы</h1> */}
        <SortBtns
          onChangeSort={setSort}
          activeSort={sort}
          arrSort={[
            { index: 1, name: "Титула" },
            { index: 2, name: "Документация" },
            { index: 3, name: "Ресурсы" },
            { index: 4, name: "Факт" },
          ]}
        />
      </div>
      <div className="separator"></div>
      <div className="entity_section">
        <CardsList cardsList={data} isGridContainer={false} />
      </div>
    </div>
  );
};

export default MainPage;
