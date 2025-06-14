import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
// import { useNavigate } from 'react-router-dom';
import { MainAppContainer } from '../../pages/entityPage';
import PostgresApi from '../../services/PostgresApi';
import Loader from '../loader/Loader';
import './style.scss';
import SortBtns from '../sortBtns/SortBtns';
import AggItemMain from '../aggItemMain/AggItemMain';
import AddFactForm from '../addFactForm/AddFactForm';
import Modal from '../modal/Modal';
import { useSelector } from 'react-redux';
import { useContext } from 'react';
import { InstallerContext } from '../App/App';

const EntityProfile = () => {
  const postgresApi = new PostgresApi();
  const { titleID } = useParams();
  const [titleData, setTitleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const volume = useSelector((state) => state.volume.current);
  // Создаем эффект для получение из базы данных по выбранному объекту по titleID
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await postgresApi.getEntity(`/api/title/${titleID}`);
        setTitleData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [titleID, volume]);

  useEffect(() => {
    //Если volume = true, то отображаем модальное окно внесения факта
    if (volume) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [volume]);

  if (loading) {
    return <Loader />;
  }

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return titleData ? (
    <>
      <View data={titleData?.data} />
      {isModalOpen && (
        <Modal onClose={handleModalClose}>
          <AddFactForm current={volume} brevis={titleData.data.brevis} />
        </Modal>
      )}
    </>
  ) : (
    <Loader />
  );
};

const View = ({ data }) => {
  const {
    installer: { theme },
  } = useContext(InstallerContext);
  const navigate = useNavigate();
  const [sort, setSort] = useState(1);
  const { brevis, full_name, aggByVolume, aggByDesign } = data;
  return (
    <MainAppContainer>
      <div className={`entity_container ${theme}-theme__container`}>
        <div className={`entity_section ${theme}-theme__section`}>
          <h2>{brevis}</h2>
          <h3>{full_name}</h3>
        </div>
        <div className="separator"></div>
        <div className={`entity_section ${theme}-theme__section`}>
          <h3>Основная информация</h3>
          <SortBtns
            onChangeSort={setSort}
            activeSort={sort}
            arrSort={[
              { index: 1, name: 'Объем' },
              { index: 2, name: 'Документация' },
            ]}
          />
          {aggByVolume.length === 0 ? (
            <p>Нет данных</p>
          ) : (
            <AggByVolumeView
              sort={sort}
              aggByVolume={aggByVolume}
              aggByDesign={aggByDesign}
            />
          )}
        </div>
        <button
          className="entity_container__button"
          onClick={() => navigate('/main')}
        >
          Назад
        </button>
      </div>
    </MainAppContainer>
  );
};

const AggByVolumeView = ({ sort, aggByVolume, aggByDesign }) => {
  const data = sort === 1 ? aggByVolume : aggByDesign;
  return (
    <ul className="entity_volumes_list">
      {data.map((agg, index) => (
        <AggItemMain key={index} data={agg} />
      ))}
    </ul>
  );
};
export default EntityProfile;
