import { useEffect, useState } from "react";
import PostgresApi from "../services/PostgresApi";
import styled from "styled-components";
import CardsList from "../components/cardsList/CardsList";
import { useSelector } from "react-redux";
import Loader from "../components/loader/Loader";
import "../components/entityProfile/style.scss";
import SortBtns from "../components/sortBtns/SortBtns";

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

  useEffect(() => {
    postgresApi.getEntity("/api/titles").then((res) => {
      setTitles([...res.data]);
    });
  }, []);

  useEffect(() => {
    if (titles.length > 0) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [titles]);

  return (
    <>
      <MainAppContainer>
        {/* {loading ? <Loader /> : <View titles={titles} />} */}
        {loading ? <Loader /> : <ViewMain sort={sort} setSort={setSort} />}
      </MainAppContainer>
    </>
  );
};

const View = ({ titles }) => {
  return (
    <>
      <h1>Выберите объект для внесения факта</h1>
      <CardsList cardsList={titles} entity={"title"} />
    </>
  );
};

const ViewMain = ({ sort, setSort }) => {
  return (
    <div className="entity_container">
      <div className="entity_section">
        {/* <h1>Это главная страница программы</h1> */}
        <SortBtns
          onChangeSort={setSort}
          activeSort={sort}
          arrSort={[
            { index: 1, name: "Объемы" },
            { index: 2, name: "Титула" },
            { index: 3, name: "Документация" },
            { index: 4, name: "Ресурсы" },
            { index: 5, name: "Факт" },
          ]}
        />
      </div>
    </div>
  );
};

export default MainPage;
