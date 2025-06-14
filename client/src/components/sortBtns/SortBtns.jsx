import './style.scss';

const SortBtns = ({ activeSort, arrSort, onChangeSort }) => {
  return (
    <div className="sort_btn_group">
      {arrSort.map((sort) => (
        <div
          key={sort.index}
          className={`sort_btn_wrapper ${
            activeSort === sort.index && `sort_btn_wrapper_active`
          }`}
        >
          <input
            type="radio"
            name="sort_radio"
            id={`sort_${sort.index}`}
            checked={activeSort === sort.index}
            onChange={() => {
              onChangeSort(sort.index);
            }}
          />
          <label htmlFor={`sort_${sort.index}`}>
            {sort.name ?? sort.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default SortBtns;
