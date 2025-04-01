import { useState } from "react";
import "./style.scss";
import Btn from "../Btn/btn";
import { useDispatch } from "react-redux";
import { setCurrentVolume } from "../../redux/slices/volumeSlice";
import StatsSummary from "../statsSummary/StatsSummary";

const AggItemChildren = ({ childData, unit_main }) => {
  if (!childData) return null;
  const { brevis, full_name, value, name, unit, fact, percent, remains } =
    childData;
  return (
    <p>
      {brevis && (
        <>
          <span>{brevis}</span>
          <span className="entity_full_name">{full_name.split(".").pop()}</span>
          <StatsSummary
            sum={value}
            fact={fact}
            percent={percent}
            remains={remains}
            // unit={unit}
            isSumFirst={true}
          />
          {/* <span>
            {(+value).toLocaleString("ru-RU")} {unit_main}
          </span> */}
        </>
      )}
      {name && (
        <>
          <span>
            {name}, {unit}
          </span>
          <StatsSummary
            sum={value}
            fact={fact}
            percent={percent}
            remains={remains}
            // unit={unit}
            isSumFirst={true}
          />
          {/* <span>
            {(+value).toLocaleString("ru-RU")} {unit}
          </span> */}
        </>
      )}
    </p>
  );
};

const AggItemMain = ({ data }) => {
  const [visibleBtnRound, setVisibleBtnRound] = useState(false);
  const dispatch = useDispatch();
  if (!data) {
    return null;
  }
  const {
    name,
    fact,
    sum,
    percent,
    remains,
    unit,
    aggValue,
    brevis,
    full_name,
    volumes,
  } = data;
  const handleMouseOver = () => {
    setVisibleBtnRound(true);
  };
  const handleMouseOut = () => {
    setVisibleBtnRound(false);
  };
  // Обработчик события при нажатии на кнопку добавить факт, открывается модальное окно
  const handleClick = () => {
    const currentVolumes = {
      ...(name && { name, isDesign: false }),
      ...(aggValue && { array: aggValue }),
      ...(brevis && { name: brevis, isDesign: true }),
      ...(volumes && { array: volumes }),
    };
    // Используя dispatch сохраняем объем в который будем добавляться факт
    if (currentVolumes) {
      // console.log(currentVolumes);
      dispatch(setCurrentVolume(currentVolumes));
    }
  };
  // console.log(data);
  return (
    <li>
      <details>
        <summary
          className={`${name ? "summary_with_volume" : "summary_with_design"}`}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          {name && (
            <>
              <span className="entity_volume_name">
                {name}, {unit}
              </span>
              <div
                className="summary_wrapper"
                style={name ? {} : { width: "100%" }}
              >
                <div className="entity_volume_wrapper">
                  <StatsSummary
                    fact={fact}
                    sum={sum}
                    percent={percent}
                    remains={remains}
                    // unit={unit}
                    isSumFirst={true}
                  />
                </div>
                <div
                  className={`btn_round_wrapper ${
                    visibleBtnRound ? "visible" : ""
                  }`}
                >
                  <Btn
                    btnClassName={"button_round blue"}
                    icon={"fas fa-plus"}
                    onClickBtn={handleClick}
                  />
                </div>
              </div>
            </>
          )}

          {brevis && (
            <>
              <span className="entity_volume_name nowrap">{brevis}</span>
              <span className="entity_volume_name long">
                {full_name.split(".").pop()}
              </span>
              <div
                className={`btn_round_wrapper ${
                  visibleBtnRound ? "visible" : ""
                }`}
              >
                <Btn
                  btnClassName={"button_round blue"}
                  icon={"fas fa-plus"}
                  onClickBtn={handleClick}
                />
              </div>
            </>
          )}
        </summary>
        {aggValue?.map((data) => (
          <AggItemChildren key={data.id} childData={data} unit_main={unit} />
        ))}
        {volumes?.map((data) => (
          <AggItemChildren key={data.id} childData={data} unit={unit} />
        ))}
      </details>
    </li>
  );
};

export default AggItemMain;
