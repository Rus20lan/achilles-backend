import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
// import { useNavigate } from 'react-router-dom';
import { MainAppContainer } from "../../pages/mainPage";
import PostgresApi from "../../services/PostgresApi";
import Loader from "../loader/Loader";
import "./style.scss";
import SortBtns from "../sortBtns/SortBtns";

const EntityProfile = () => {
  // const history = useNavigate();

  const postgresApi = new PostgresApi();
  const { titleID } = useParams();
  const [titleData, setTitleData] = useState(null);
  const [loading, setLoading] = useState(true);
  // Создаем эффект для получение из базы данных по выбранному объекту по titleID
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await postgresApi.getEntity(`/api/title/${titleID}`);
        setTitleData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [titleID]);

  if (loading) {
    return <Loader />;
  }

  return titleData ? <View data={titleData?.data} /> : <Loader />;
};

const View = ({ data }) => {
  const navigate = useNavigate();
  const [sort, setSort] = useState(1);
  const {
    brevis,
    full_name,
    volumes,
    design,
    resource,
    aggByVolume,
    aggByDesign,
  } = data;
  console.log(data);

  return (
    <MainAppContainer>
      <div className="entity_container">
        <div className="entity_section">
          <h2>{brevis}</h2>
          <h3>{full_name}</h3>
        </div>
        <div className="separator"></div>
        <div className="entity_section">
          <h3>Основная информация</h3>
          <SortBtns
            onChangeSort={setSort}
            activeSort={sort}
            arrSort={[
              { index: 1, name: "Объем" },
              { index: 2, name: "Документация" },
            ]}
          />
          {aggByVolume.length === 0 ? (
            <p>Нет данных</p>
          ) : sort === 1 ? (
            <AggByVolumeView aggByVolume={aggByVolume} />
          ) : (
            <AggByVolumeView aggByDesign={aggByDesign} />
          )}
        </div>
        <button onClick={() => /*history.back()*/ navigate("/main")}>
          Назад
        </button>
      </div>
    </MainAppContainer>
  );
};

const AggByVolumeView = ({ aggByVolume, aggByDesign }) => {
  return (
    <ul className="entity_volumes_list">
      {aggByVolume &&
        aggByVolume.map((agg, index) => (
          <li key={index}>
            <details>
              <summary>
                <span className="entity_volume_name">{agg.name}</span>
                <span className="entity_volume_value">
                  {(+agg.sum).toLocaleString("ru-RU")} {agg.unit}
                </span>
              </summary>
              {agg.aggValue.map((design) => (
                <p key={design.valueId}>
                  <span>{design.brevis}</span>
                  <span className="entity_full_name">
                    {design.full_name.split(".").pop()}
                  </span>
                  <span>
                    {(+design.value).toLocaleString("ru-RU")} {agg.unit}
                  </span>
                </p>
              ))}
            </details>
          </li>
        ))}
      {aggByDesign &&
        aggByDesign.map((design, index) => (
          <li key={index}>
            <details>
              <summary style={{ justifyContent: "flex-start", gap: "1%" }}>
                <span className="entity_volume_name">{design.brevis}</span>
                <span className="entity_volume_name">
                  {design.full_name.split(".").pop()}
                </span>
              </summary>
              {design.volumes.map((vol) => (
                <p key={vol.id}>
                  <span>{vol.name}</span>
                  {/* <span className="entity_full_name">
                    {vol.unit}
                  </span> */}
                  <span>
                    {(+vol.value).toLocaleString("ru-RU")} {vol.unit}
                  </span>
                </p>
              ))}
            </details>
          </li>
        ))}
    </ul>
  );
};
export default EntityProfile;
