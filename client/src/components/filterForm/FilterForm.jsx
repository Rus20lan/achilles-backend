import { useState, useActionState, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { ENTITY_CONFIG } from "../../config/entities";
import SortBtns from "../sortBtns/SortBtns";
import "./style.scss";
import { InputField } from "../universalEntityForm/UniversalEntityForm";
import { InstallerContext } from "../App/App";
const initState = { index: "all", name: "Все", label: "Все" };

const FilterForm = ({
  isOpenFilter,
  entity,
  filterSort,
  setFilterSort,
  onChangeFilter,
}) => {
  const [valueAuto, setValueAuto] = useState({});
  const [filter, submitAction] = useActionState(postFilterObject, null);
  const config = ENTITY_CONFIG[entity];
  const fields = config.fields;
  const typeField = fields[filterSort]?.type;
  const titles = useSelector((state) => state.titles?.data);
  const designs = useSelector((state) => state.designs?.data);
  const resources = useSelector((state) => state.resources?.data);
  // console.log("designs", designs);
  const filterPoints = Object.fromEntries(
    Object.entries(fields).filter(([_, value]) => value.isFilter === true)
  );

  const {
    installer: { theme },
  } = useContext(InstallerContext);

  function postFilterObject(prevState, formData) {
    const filterField = formData.get([filterSort]);
    console.log("valueAuto", valueAuto);
    if (filterField) {
      console.log("filterField=", filterField, "filterSort=", filterSort);
      onChangeFilter({ [filterSort]: filterField });
    } else if (
      valueAuto &&
      (valueAuto?.title || valueAuto?.design || valueAuto.resource)
    ) {
      for (const [key, value] of Object.entries(valueAuto)) {
        if (entity === "volume") {
          let newValue = undefined;
          switch (key) {
            case "title":
              newValue = fields[key]?.getId(titles, "brevis", value);
              break;
            case "design":
              newValue = fields[key]?.getId(designs, "brevis", value);
              break;
            case "resource":
              newValue = fields[key]?.getId(resources, "name", value);
              break;
          }
          const newFilterField = key + "Id";
          // console.log(fields[key].getId(titles, "brevis", value));
          onChangeFilter({ [newFilterField]: newValue });
        }
      }
    } else {
      console.log("Данные не валидны");
      return null;
    }
  }

  const handleChangeSort = (index) => {
    setFilterSort(index);
    onChangeFilter(null);
  };

  const handleChangeAutoComplete = (field, value) => {
    setValueAuto({ [field]: value });
  };

  const handleCancel = () => {
    // setFilterSort("all");
    setValueAuto({});
    // onChangeFilter(null);
  };
  return (
    <>
      <div
        className={`filter-form__container ${
          isOpenFilter ? "filter-form__container_open" : ""
        } ${theme}-theme__filter-form`}
      >
        <SortBtns
          activeSort={filterSort}
          arrSort={[initState, ...Object.values(filterPoints)]}
          onChangeSort={handleChangeSort}
        />
        {filterSort !== "all" && (
          <form action={submitAction}>
            {typeField !== "autocomplete" && (
              <InputField
                name={filterSort}
                config={filterPoints[filterSort]}
                hideLabel={true}
              />
            )}
            {typeField === "autocomplete" && (
              <InputField
                name={filterSort}
                value={valueAuto[[filterSort]] ?? ""}
                onChange={handleChangeAutoComplete}
                config={filterPoints[filterSort]}
                hideLabel={true}
              />
            )}
            <div className="filter-form__button-group ">
              <button type="submit">Применить</button>
              <button type="button" onClick={handleCancel}>
                Отмена
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};
export default FilterForm;
