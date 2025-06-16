export function getIdEntity(array, searchField, searchWord) {
  const findEntity = array.find((entity) => entity[searchField] === searchWord);
  console.log("findId", findEntity);
  return findEntity
    ? findEntity?.id ?? findEntity.titleId ?? findEntity.titleID
    : null;
}
