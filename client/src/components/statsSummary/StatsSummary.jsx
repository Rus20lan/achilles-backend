import "./style.scss";

const StatsSummary = ({ fact, percent, remains, sum, unit, isSumFirst }) => {
  return (
    <>
      {isSumFirst && (
        <span>
          {(+sum).toLocaleString("ru-RU")} <small>{unit || null}</small>
        </span>
      )}
      <span className="summary_fact_percent_remains">
        {fact}
        <small>
          <sup> {`${percent} %`}</sup>
          {remains && <sub>{remains}</sub>}
        </small>
      </span>
      {!isSumFirst && (
        <span>
          {(+sum).toLocaleString("ru-RU")} <small>{unit || null}</small>
        </span>
      )}
    </>
  );
};

export default StatsSummary;
