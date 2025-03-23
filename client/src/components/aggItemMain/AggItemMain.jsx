import { useState } from 'react';
import './style.scss';
import Btn from '../Btn/btn';
import { useDispatch } from 'react-redux';
import { setCurrentVolume } from '../../redux/slices/volumeSlice';

const AggItemChildren = ({ childData, unit_main }) => {
  if (!childData) return null;
  const { brevis, full_name, value, name, unit } = childData;
  return (
    <p>
      {brevis && (
        <>
          <span>{brevis}</span>
          <span className="entity_full_name">{full_name.split('.').pop()}</span>
          <span>
            {(+value).toLocaleString('ru-RU')} {unit_main}
          </span>
        </>
      )}
      {name && (
        <>
          <span>{name}</span>
          <span>
            {(+value).toLocaleString('ru-RU')} {unit}
          </span>
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
  const { name, sum, unit, aggValue, brevis, full_name, volumes } = data;
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
      console.log(currentVolumes);
      dispatch(setCurrentVolume(currentVolumes));
    }
  };

  return (
    <li>
      <details>
        <summary onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
          {name && <span className="entity_volume_name">{name}</span>}
          <div className="summary_wrapper">
            {sum && (
              <span className="entity_volume_value">
                {(+sum).toLocaleString('ru-RU')} {unit}
              </span>
            )}
            {brevis && (
              <>
                <span className="entity_volume_name nowrap">{brevis}</span>
                <span className="entity_volume_name long">
                  {full_name.split('.').pop()}
                </span>
              </>
            )}
            <div
              className={`btn_round_wrapper ${
                visibleBtnRound ? 'visible' : ''
              }`}
            >
              <Btn
                btnClassName={'button_round blue'}
                icon={'fas fa-plus'}
                onClickBtn={handleClick}
              />
            </div>
          </div>
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
