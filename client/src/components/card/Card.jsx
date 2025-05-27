import { Link } from 'react-router';
import moment from 'moment';
import './style.scss';
import Btn from '../Btn/btn';
import { useContext, useRef, useState } from 'react';
import useCloseOnOutsideClick from '../../hooks/useCloseOnOutsideClick';
import { InstallerContext } from '../App/App';

const factBtnIconClass = [
  {
    icon: 'fa fa-trash',
    btnClassName: 'button_round red-40',
    arrowColor: '#b3261e',
    mode: 'delete',
  },
  {
    icon: 'fa fa-pencil',
    btnClassName: 'button_round blue',
    arrowColor: '#547aa5',
    mode: 'edit',
  },
];

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
    factId,
    valueId,
    fact,
    onClickEditBtn,
    onClickDeleteBtn,
  } = props;

  let inputId = '';
  let objId = {};
  const {
    installer: { theme },
  } = useContext(InstallerContext);
  switch (entity) {
    case 'title':
      inputId = `${entity}-${title_code}`.replace(/\./g, '-');
      objId.id = id;
      break;
    case 'design':
      inputId = `${entity}-${brevis}`.replace(/\./g, '-');
      objId.id = id;
      break;
    case 'resource':
      inputId = CSS.escape(
        `${entity}-${
          name?.includes(' ') ? name.replace(' ', '-') : name
        }-${unit}`
      );
      objId.id = id;
      break;
    case 'fact':
      inputId = CSS.escape(`${entity}-${fact + unit}`);
      objId.id = factId;
      objId.valueId = valueId;
      break;
  }

  const [isChecked, setIsChecked] = useState(false);
  const inputRef = useRef(null);

  useCloseOnOutsideClick(inputRef, isChecked, setIsChecked);

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleMenuAction = (actionCallback) => {
    return () => {
      actionCallback();
      setIsChecked(false);
    };
  };

  return (
    <>
      {isGridContainer && (
        <li className="card_wrapper">
          <Link to={`/${entity}/${id}`}>{brevis}</Link>
          <p>{full_name}</p>
        </li>
      )}
      {!isGridContainer && (
        <li className={`card_wrapper_line ${theme}-theme__card_wrapper_line`}>
          <div className="card_info_block">
            {entity !== 'fact' && (
              <>
                <div className="card_firts_line">
                  {brevis && <p className=" name_field no_shrink">{brevis}</p>}
                  {full_name && (
                    <p className={`value_field ${theme}-theme__value_field`}>
                      {full_name}
                    </p>
                  )}
                  {name && <p className="value_field">{name}</p>}
                </div>
                <div className="card_second_line">
                  {title_code && (
                    <p>
                      <span className="name_field">Код: </span>
                      <span
                        className={`value_field ${theme}-theme__value_field`}
                      >
                        {title_code}
                      </span>
                    </p>
                  )}
                  {code && (
                    <p>
                      <span className="name_field">Шифр: </span>
                      <span className="value_field_second">{code}</span>
                    </p>
                  )}
                  {mark && (
                    <p style={{ justifyContent: 'flex-end' }}>
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
            {entity === 'fact' && (
              <>
                <div className="card_fact_line">
                  {dateString && (
                    <>
                      <p className=" name_field no_shrink">
                        {moment(dateString).format('DD.MM.YYYY')}
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
              {/* {entity !== 'fact' && (
                <Btn
                  btnClassName={'button_round blue'}
                  icon={'fa fa-pencil'}
                  onClickBtn={() => {
                    onClickEditBtn({
                      ...(factId ?? { id }),
                      ...(factId && { id: factId, valueId }),
                      ...(titleId && !factId && { id: titleId }),
                    });
                  }}
                />
              )} */}
              <div className="ms-nav-container">
                <ul className="ms-nav">
                  <input
                    ref={inputRef}
                    type="checkbox"
                    id={inputId}
                    className="ms-menu-toggle"
                    name="ms-menu-toggle"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                  {factBtnIconClass.map((factBtn, index) => (
                    <li
                      key={index}
                      className={`ms-li ${
                        factBtnIconClass.length === index + 1
                          ? 'ms-li-last'
                          : ''
                      }`}
                      style={{
                        '--item-index': index,
                        '--bg-color': factBtn.arrowColor,
                      }}
                    >
                      <Btn
                        icon={factBtn.icon}
                        btnClassName={factBtn.btnClassName}
                        onClickBtn={handleMenuAction(() => {
                          switch (factBtn.mode) {
                            case 'edit':
                              // onClickEditBtn({ id: factId, valueId });
                              onClickEditBtn(objId);
                              break;
                            case 'delete':
                              // onClickDeleteBtn({
                              //   id: factId,
                              //   valueId,
                              // });
                              onClickDeleteBtn(objId);
                              break;
                          }
                        })}
                      />
                    </li>
                  ))}
                  <li
                    className="ms-main"
                    style={{ '--bg-main-btn': '#6750a4' }}
                  >
                    <label htmlFor={inputId}>
                      <Btn
                        icon={'fa fa-angle-double-left'}
                        btnClassName={'button_round plus'}
                        onClickBtn={() => setIsChecked(!isChecked)}
                      />
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </li>
      )}
    </>
  );
};

export default Card;
