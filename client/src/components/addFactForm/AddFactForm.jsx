import { memo, useCallback, useEffect, useState, useRef } from "react";
import "./style.scss";
import Btn from "../Btn/btn";
import { useDispatch } from "react-redux";
import { remoteCurrentVolume } from "../../redux/slices/volumeSlice";

const Select = ({ fact, options, onChange }) => {
  const handleChange = (e) => {
    onChange({ ...fact, valueId: +e.target.value });
  };
  return (
    <select
      className="selected-option"
      value={fact.valueId || ""}
      onChange={handleChange}
    >
      {options &&
        options.map((option, index) => (
          <option key={index} value={option.valueId}>
            {option.brevis}
          </option>
        ))}
    </select>
  );
};

const Fact = memo(({ options, id, initFact, onChange, onRemote }) => {
  const [fact, setFact] = useState(
    initFact ?? { id, fact: 0, date: "", valueId: 0 }
  );

  useEffect(() => {
    // Проверка что fact не равен переданному в props initFact
    if (JSON.stringify(fact) !== JSON.stringify(initFact)) {
      onChange(fact);
    }
  }, [fact, initFact, onChange]);

  const handleChangeBySelect = (fact) => {
    setFact(fact);
  };
  const handleChangeByInput = (e) => {
    const { name, value } = e.target;
    const num = !isNaN(value) ? +value : value;
    setFact((prevFact) => ({
      ...prevFact,
      [name]: num,
    }));
  };
  return (
    <li className="group_inputs">
      <Select fact={fact} options={options} onChange={handleChangeBySelect} />
      <input
        type="date"
        name="date"
        value={fact.date}
        onChange={handleChangeByInput}
      />
      <input
        type="number"
        name="fact"
        min="0"
        step="0.01"
        value={fact.fact}
        onChange={handleChangeByInput}
      />
      <input type="number" disabled />
      <Btn
        btnClassName={"button_round red-40"}
        icon={"fas fa-close"}
        onClickBtn={() => {
          onRemote(fact);
        }}
      />
    </li>
  );
});

const AddFactForm = ({ current, brevis }) => {
  const [factArray, setFactArray] = useState([]);
  const dispatch = useDispatch();
  const saveRef = useRef(null); // saveRef - для кнопки Сохранить
  const cancelRef = useRef(null); // cancelRef - для кнопки Отмена
  const handleClickAddEmptyFactString = () => {
    setFactArray((factArray) => {
      // crypto.randomUUID()
      const newFact = {
        id: Date.now(),
        fact: 0,
        date: new Date().toISOString().split("T")[0],
        valueId: current?.array?.[0]?.valueId || 0,
      };
      return [...factArray, newFact];
    });
  };

  const onUpdateFactInArray = useCallback((fact) => {
    setFactArray((factArray) =>
      factArray.map((item) => (item.id === fact.id ? fact : item))
    );
  }, []);
  const handleRemoteFactInFactArray = useCallback((fact) => {
    setFactArray((factArray) =>
      factArray.filter((item) => item.id !== fact.id)
    );
  }, []);
  console.log(factArray);
  return (
    <div className="modal_context">
      <div className="form_fact_container">
        <div>
          <p className="p_first_line">Объект: {brevis}</p>
          <p className="p_second_line">Физ.объем: {current?.name}</p>
        </div>
        {factArray.length > 0 && (
          <>
            <div className="group_inputs">
              <label>РД</label>
              <label>Дата</label>
              <label>Факт</label>
              <label>Остаток</label>
            </div>
            <ul>
              {factArray.map((fact) => (
                <Fact
                  key={fact.id}
                  options={current.array}
                  initFact={fact}
                  id={fact.id}
                  onChange={onUpdateFactInArray}
                  onRemote={handleRemoteFactInFactArray}
                />
              ))}
            </ul>
            <div className="btn_round_wrapper btn_center visible">
              <Btn
                btnClassName={"button_round blue"}
                icon={"fas fa-plus"}
                onClickBtn={handleClickAddEmptyFactString}
              />
            </div>
          </>
        )}
        {factArray.length === 0 && (
          <div className="btn_round_wrapper btn_center visible">
            <Btn
              btnClassName={"button_round blue"}
              icon={"fas fa-plus"}
              onClickBtn={handleClickAddEmptyFactString}
            />
          </div>
        )}
        <div className="group_btns btn_rectangle_wrapper">
          <Btn
            ref={saveRef}
            text={"Сохранить"}
            btnClassName={"icon_white green-ok"}
            onClickBtn={() => {
              dispatch(remoteCurrentVolume());
            }}
          />
          <Btn
            ref={cancelRef}
            text={"Отмена"}
            btnClassName={"icon_white red-40"}
          />
        </div>
      </div>
    </div>
  );
};

export default AddFactForm;
