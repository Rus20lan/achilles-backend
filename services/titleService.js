import { totalFact } from "./factService.js";

export function aggregationByVolume(volumes) {
  if (!volumes) return []; // Ранний возврат если volumes пустой

  const aggByVolume = [];
  const resIdSet = new Set(volumes.map((vol) => vol.resourceId));
  for (let resId of resIdSet) {
    const filter = volumes.filter((vol) => vol.resourceId === resId);
    const name = filter[0].Resource.name;
    const unit = filter[0].Resource.unit;
    const sum = filter
      .map((item) => item.value)
      .reduce((acc, curr) => acc + curr, 0)
      .toFixed(2);
    console.log(filter);

    const factValues = filter[0]?.Fact?.values || null;
    let fact = 0;
    for (const item of filter) {
      if (item?.Fact?.values) {
        fact += totalFact(factValues);
      }
    }

    const percent = ((fact / sum) * 100).toFixed(1);

    aggByVolume.push({
      name,
      unit,
      sum,
      fact,
      percent,
      remains: fact > 0 ? sum - fact : null,
      aggValue: filter.map((val) => ({
        id: val.id,
        value: val.value,
        designId: val.designId,
        brevis: val.Design.brevis,
        full_name: val.Design.full_name,
        mark: val.Design.mark,
        // fact: val?.Fact?.values ? totalFact(val.Fact.values) : 0,
      })),
    });
  }

  return aggByVolume;
}
export function aggregationByDesign(volumes) {
  if (!volumes) return [];

  const aggByDesign = [];
  const desIdMap = new Map();
  // Группируем volumes по designId
  // const resIdDesign = new Set(volumes.map((vol) => vol.Design.id));

  for (const volume of volumes) {
    if (!desIdMap.has(volume.designId)) {
      desIdMap.set(volume.designId, {
        id: volume.Design.id,
        brevis: volume.Design.brevis,
        full_name: volume.Design.full_name,
        volumes: [],
      });
    }
    const group = desIdMap.get(volume.designId);
    group.volumes.push({
      value: volume.value,
      name: volume.Resource.name,
      unit: volume.Resource.unit,
      id: volume.id,
    });
  }

  // Преобразуем Map в массив
  for (const group of desIdMap.values()) {
    aggByDesign.push(group);
  }

  return aggByDesign;
}
