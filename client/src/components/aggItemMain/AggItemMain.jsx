import { useState } from 'react';
import './style.scss';
import Btn from '../Btn/btn';

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
  if (!data) {
    return null;
  }
  console.log(data);
  const { name, sum, unit, aggValue, brevis, full_name, volumes } = data;
  const handleMouseOver = () => {
    setVisibleBtnRound(true);
  };
  const handleMouseOut = () => {
    setVisibleBtnRound(false);
  };
  return (
    <li>
      <details>
        <summary
          style={brevis && { justifyContent: 'flex-start', gap: '1%' }}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >
          {name && <span className="entity_volume_name">{name}</span>}
          <div className="summary_wrapper">
            {sum && (
              <span className="entity_volume_value">
                {(+sum).toLocaleString('ru-RU')} {unit}
              </span>
            )}
            {brevis && (
              <>
                <span className="entity_volume_name">{brevis}</span>
                <span className="entity_volume_name">
                  {full_name.split('.').pop()}
                </span>
              </>
            )}
            <div
              className={`btn_round_wrapper ${
                visibleBtnRound ? 'visible' : ''
              }`}
            >
              <Btn btnClassName={'button_round'} icon={'fas fa-plus'} />
            </div>
          </div>
        </summary>
        {aggValue?.map((data) => (
          <AggItemChildren
            key={data.valueId}
            childData={data}
            unit_main={unit}
          />
        ))}
        {volumes?.map((data) => (
          <AggItemChildren key={data.id} childData={data} unit={unit} />
        ))}
      </details>
    </li>
  );
};

export default AggItemMain;
