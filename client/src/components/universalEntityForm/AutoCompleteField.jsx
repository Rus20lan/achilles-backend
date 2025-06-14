import React, { useEffect, useRef, useState } from 'react';

const AutoCompleteField = React.memo(
  ({ name, value = '', options, onChange, error }) => {
    const wrapperRef = useRef(null);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
    const lastValidValue = useRef(value); // Храним последнее валидное значение

    // Поиск полного совпадения в оригинальных опциях
    const findExactMatch = (searchValue) => {
      return options.find(
        (option) =>
          (option.brevis || option.name)?.toLowerCase() ===
          searchValue.toLowerCase()
      );
    };

    // Фильтрация опций
    useEffect(() => {
      const searchValue = value.toString();
      const exactMatch = findExactMatch(searchValue);
      // Обновляем последнее валидное значение при совпадении
      if (exactMatch) {
        lastValidValue.current = exactMatch.brevis || exactMatch.name;
      }
      // Фильтрация для отображения списка
      const filtered = options.filter((option) => {
        const fieldValue = option.brevis || option.name || '';
        return fieldValue.toLowerCase().includes(searchValue.toLowerCase());
      });
      setFilteredOptions(() => {
        if (filtered.length > 5) return filtered.slice(0, 5);
        return filtered;
      });
      // setFilteredOptions(filtered);
    }, [value]);

    // Закрытие списка при клике вне компонента
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
          onChange(name, lastValidValue.current);
          setShowOptions(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);

      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e) => {
      const newValue = e.target.value;
      const exactMatch = findExactMatch(newValue);
      // Разрешаем ввод только если есть частичное совпадение
      if (
        exactMatch ||
        newValue === '' ||
        options.some((option) => {
          const fieldValue = option.brevis || option.name || '';
          return fieldValue.toLowerCase().includes(newValue.toLowerCase());
        })
      ) {
        onChange(name, newValue);
      } else {
        onChange(name, lastValidValue.current);
      }
      // onChange(name, newValue);
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
                  key={option.id ?? option.titleID}
                  onClick={() => {
                    onChange(name, option.brevis || option.name);
                    setShowOptions(false);
                  }}
                >
                  {option.brevis ?? option.name}
                </li>
              ))
            ) : (
              <li>Список пуст</li>
            )}
          </ul>
        )}
      </div>
    );
  }
);

export default AutoCompleteField;
