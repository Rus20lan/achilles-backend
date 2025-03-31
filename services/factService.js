import Fact from "../models/Fact.js";

export function validateFactValuesAndNewFact(valuesInBD, fact) {
  const foundFact = valuesInBD.find(
    (item) => item.dateString === fact.dateString && item.fact === fact.fact
  );
  if (foundFact) {
    return true;
  } else {
    return false;
  }
}

export function totalFact(factArray) {
  return (
    factArray?.map((fact) => fact.fact).reduce((acc, curr) => acc + curr) || 0
  );
}
