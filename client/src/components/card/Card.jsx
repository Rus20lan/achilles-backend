import { Link } from "react-router";
import moment from "moment";
import "./style.scss";
import Btn from "../Btn/btn";
const Card = (props) => {
  const {
    name,
    unit,
    full_name,
    brevis,
    id,
    isGridContainer,
    title_code,
    code,
    entity,
    mark,
    dateString,
    titleId,
    factId,
    fact,
    onClickEditBtn,
  } = props;
  return (
    <>
      {isGridContainer && (
        <li className="card_wrapper">
          <Link to={`/${entity}/${id}`}>{brevis}</Link>
          <p>{full_name}</p>
        </li>
      )}
      {!isGridContainer && (
        <li className="card_wrapper_line">
          <div className="card_info_block">
            {entity !== "fact" && (
              <>
                <div className="card_firts_line">
                  {brevis && <p className=" name_field no_shrink">{brevis}</p>}
                  {full_name && <p className="value_field">{full_name}</p>}
                  {name && <p className="value_field">{name}</p>}
                </div>
                <div className="card_second_line">
                  {title_code && (
                    <p>
                      <span className="name_field">Код: </span>
                      <span className="value_field">{title_code}</span>
                    </p>
                  )}
                  {code && (
                    <p>
                      <span className="name_field">Шифр: </span>
                      <span className="value_field_second">{code}</span>
                    </p>
                  )}
                  {mark && (
                    <p style={{ justifyContent: "flex-end" }}>
                      <span className="name_field">Марка: </span>
                      <span className="value_field_second">{mark}</span>
                    </p>
                  )}
                  {unit && (
                    <p>
                      <span className="name_field">Ед.изм:</span>
                      <span className="value_field_second">{unit}</span>
                    </p>
                  )}
                </div>
              </>
            )}
            {entity === "fact" && (
              <>
                <div className="card_fact_line">
                  {dateString && (
                    <>
                      <p className=" name_field no_shrink">
                        {moment(dateString).format("DD.MM.YYYY")}
                      </p>
                      <p className=" value_field no_shrink">{brevis}</p>
                      <p className=" name_field no_shrink">{name}</p>
                      <p className=" value_field no_shrink">
                        <span>{fact}</span>
                        <span>{unit}</span>
                      </p>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="card_btn_block">
            <div className="btn_round_wrapper visible">
              <Btn
                btnClassName={"button_round blue"}
                icon={"fa fa-pencil"}
                onClickBtn={() => {
                  onClickEditBtn({
                    ...(factId ?? { id }),
                    ...(factId && { id: factId }),
                    ...(titleId && { id: titleId }),
                  });
                }}
              />
            </div>
          </div>
        </li>
      )}
    </>
  );
};

export default Card;
