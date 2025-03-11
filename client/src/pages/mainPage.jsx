import { useEffect, useState } from 'react';
import PostgresApi from '../services/PostgresApi';
import styled from 'styled-components';
import CardsList from '../components/cardsList/CardsList';
import { useSelector } from 'react-redux';
import Loader from '../components/loader/Loader';

export const MainAppContainer = styled.div`
  max-width: 1180px;
  width: 95%;
  margin: 0 auto;
`;

const MainPage = () => {
  const postgresApi = new PostgresApi();
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    postgresApi.getEntity('/api/titles').then((res) => {
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
        {loading ? <Loader /> : <View titles={titles} />}
      </MainAppContainer>
    </>
  );
};

const View = ({ titles }) => {
  return (
    <>
      <h1>Выберите объект для внесения факта</h1>
      <CardsList cardsList={titles} entity={'title'} />
    </>
  );
};

export default MainPage;
