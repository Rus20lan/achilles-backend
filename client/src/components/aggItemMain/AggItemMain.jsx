import './style.scss';

const AggItemChildren = ({ childData, unit_main }) => {
  if (!childData) return null;
  const { brevis, full_name, value, name, unit } = childData;
  console.log(unit);
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
  if (!data) {
    return null;
  }
  const { name, sum, unit, aggValue, brevis, full_name, volumes } = data;
  console.log(data);
  return (
    <li>
      <details>
        <summary style={brevis && { justifyContent: 'flex-start', gap: '1%' }}>
          {name && <span className="entity_volume_name">{name}</span>}
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
