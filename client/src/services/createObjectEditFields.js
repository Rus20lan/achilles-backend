// Функция создает новый объект поля для редактирования из переданных параметров entity и data
import { ENTITY_CONFIG } from '../config/entities';
function createObjectEditFields(entityType, data = null, mode = null) {
  const fields = ENTITY_CONFIG[entityType].fields;
  const visibleFields = Object.fromEntries(
    Object.entries(fields).filter(([key, value]) => value.isVisible === true)
  );
  const resultObj = {};
  if (mode) {
    // Если mode == create
    for (const createName of Object.keys(visibleFields)) {
      if (fields[createName].type === 'number') {
        resultObj[createName] = 0;
      } else {
        resultObj[createName] = '';
      }
    }
  } else {
    for (const editName of Object.keys(visibleFields)) {
      resultObj[editName] = data[editName];
    }

    if (entityType === 'fact') {
      resultObj['fact'] = +data['fact'];
      resultObj['valueId'] = data['valueId'];
      resultObj['volumeId'] = data['volumeId'];
      resultObj['unit'] = data['unit'];
    }
  }

  // console.log('Данные БД', resultObj);
  return resultObj;
}

export default createObjectEditFields;
