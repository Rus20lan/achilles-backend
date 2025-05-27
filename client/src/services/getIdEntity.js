export function getIdEntity(array, searchField, searchWord) {
  const findEntity = array.find((entity) => entity[searchField] === searchWord);
  return findEntity ? findEntity?.id : null;
}
