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
    aggByVolume.push({
      name,
      unit,
      sum,
      aggValue: filter.map((val) => ({
        valueId: val.id,
        value: val.value,
        designId: val.designId,
        brevis: val.Design.brevis,
        full_name: val.Design.full_name,
        mark: val.Design.mark,
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
      id: volume.resourceId,
    });
  }

  // Преобразуем Map в массив
  for (const group of desIdMap.values()) {
    aggByDesign.push(group);
  }

  return aggByDesign;
}
