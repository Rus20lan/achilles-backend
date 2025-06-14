import { useState, useActionState, useContext, useEffect } from 'react';
import { ENTITY_CONFIG } from '../../config/entities';
import SortBtns from '../sortBtns/SortBtns';
import Btn from '../Btn/btn';
import './style.scss';
import { InputField } from '../universalEntityForm/UniversalEntityForm';
import { InstallerContext } from '../App/App';
const initState = { index: 'all', name: 'Все', label: 'Все' };

const FilterForm = ({
  isOpenFilter,
  entity,
  filterSort,
  setFilterSort,
  onChangeFilter,
}) => {
  // const [activeSort, setActiveSort] = useState(filterSort);
  const [filter, submitAction] = useActionState(postFilterObject, null);
  const config = ENTITY_CONFIG[entity];
  const fields = config.fields;
  const typeField = fields[filterSort]?.type;
  const filterPoints = Object.fromEntries(
    Object.entries(fields).filter(([_, value]) => value.isFilter === true)
  );

  const {
    installer: { theme },
  } = useContext(InstallerContext);

  function postFilterObject(prevState, formData) {
    const filterField = formData.get([filterSort]);
    if (filterField) {
      onChangeFilter({ [filterSort]: filterField });
    } else {
      console.log('Данные не валидны');
      return null;
    }
  }

  const handleChangeSort = (index) => {
    setFilterSort(index);
    onChangeFilter(null);
  };

  return (
    <>
      <div
        className={`filter-form__container ${
          isOpenFilter ? 'filter-form__container_open' : ''
        } ${theme}-theme__filter-form`}
      >
        <SortBtns
          activeSort={filterSort}
          arrSort={[initState, ...Object.values(filterPoints)]}
          onChangeSort={handleChangeSort}
        />
        {filterSort !== 'all' && (
          <form action={submitAction}>
            <InputField
              name={filterSort}
              config={filterPoints[filterSort]}
              hideLabel={true}
              // onChange={
              //   typeField === 'autocomplete'
              //     ? (e) => {
              //         setInputValue(e.target.value);
              //       }
              //     : null
              // }
            />
            <div className="filter-form__button-group ">
              <button type="submit">Применить</button>
              <button>Отмена</button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};
export default FilterForm;
