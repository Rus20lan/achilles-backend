// Функция создает новый объект поля для редактирования из переданных параметров entity и data
import { ENTITY_CONFIG } from "../config/entities";
function createObjectEditFields(entityType, data) {
  const fields = ENTITY_CONFIG[entityType].fields;
  const editFields = Object.fromEntries(
    Object.entries(fields).filter(([key, value]) => value.isVisible === true)
  );
  const resultObj = {};
  for (const editName of Object.keys(editFields)) {
    resultObj[editName] = data[editName];
  }
  return resultObj;
}

export default createObjectEditFields;
