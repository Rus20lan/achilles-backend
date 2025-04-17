import { useState } from "react";
import "./style.scss";

const SortBtns = ({ activeSort, arrSort, onChangeSort }) => {
  //   const [activeSort, setActiveSort] = useState(1);
  return (
    <div className="sort_btn_group">
      {arrSort.map((sort) => (
        <div key={sort.index} className="sort_btn_wrapper">
          <input
            type="radio"
            name="sort_radio"
            id={`sort_${sort.index}`}
            checked={activeSort === sort.index}
            onChange={() => {
              //   setActiveSort(sort.index);
              onChangeSort(sort.index);
            }}
          />
          <label htmlFor={`sort_${sort.index}`}>{sort.name}</label>
        </div>
      ))}
    </div>
  );
};

export default SortBtns;
