import { useEffect, useRef, useState } from 'react';

const AutoCompleteField = ({ name, value, options, onChange, error }) => {
  const wrapperRef = useRef(null);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  // console.log(value);
  // Фильтрация опций
  useEffect(() => {
    const filtered = options.filter((option) => {
      if (option.brevis) {
        return option.brevis.toLowerCase().includes(value.toLowerCase());
      } else {
        return option.name.toLowerCase().includes(value.toLowerCase());
      }
    });
    setFilteredOptions(() => {
      // if (filtered.length === 0) return 'нет совпадений';
      if (filtered.length > 5) return filtered.slice(0, 5);
      return filtered;
    });
  }, [value]);

  // Закрытие списка при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const newValue = e.target.value;
    onChange(name, newValue);
    setShowOptions(true);
  };

  const handleClick = () => {
    setShowOptions((prev) => !prev);
  };
  return (
    <div ref={wrapperRef} className="universal-form__wrapper-block">
      <input
        className="universal-form__wrapper-block__field-input"
        type="text"
        value={value}
        onChange={handleChange}
        onClick={handleClick}
      />
      {showOptions && (
        <ul className="universal-form__wrapper-block-list">
          {filteredOptions.length !== 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option.id}
                onClick={() => {
                  onChange(name, option.brevis || option.name);
                  setShowOptions(false);
                }}
              >
                {option.brevis}
              </li>
            ))
          ) : (
            <li>Список пуст</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default AutoCompleteField;
