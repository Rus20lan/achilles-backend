import { useDispatch } from "react-redux";
import "./style.scss";
import { setLimit } from "../../redux/slices/dynamicPaginationSlice";

const defaultOptions = [10, 20, 50, 100];

const CustomSelect = ({
  fact = null,
  options = defaultOptions,
  onChange,
  isDesign,
  limit,
}) => {
  const dispath = useDispatch();
  const handleChange = (e) => {
    if (fact) {
      onChange({ ...fact, volumeId: +e.target.value });
    } else {
      // onChange(+e.target.value);
      dispath(setLimit(+e.target.value));
    }
  };

  return (
    <>
      {fact && (
        <select
          className="selected-option"
          value={fact.volumeId}
          onChange={handleChange}
        >
          {options &&
            options.map((option, index) => (
              <option key={index} value={option.id}>
                {isDesign ? option.name : option.brevis}
              </option>
            ))}
        </select>
      )}
      {!fact && (
        <select className="custom_select" value={limit} onChange={handleChange}>
          {options &&
            options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
        </select>
      )}
    </>
  );
};

export default CustomSelect;
