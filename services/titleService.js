import { totalFact } from "./factService.js";

export function aggregationByVolume(volumes) {
  if (!volumes?.length) return []; // Ранний возврат если volumes пустой

  const aggByVolume = [];
  const resIdSet = new Set(volumes.map((vol) => vol.resourceId));
  for (let resId of resIdSet) {
    const filteredVolumes = volumes.filter((vol) => vol.resourceId === resId);
    const firstItem = filteredVolumes[0].Resource;
    const { name, unit } = firstItem;

    const supportVolumes = filteredVolumes.map((item) => {
      const factValue = item?.Fact?.values ? +totalFact(item.Fact.values) : 0;
      const value = item.value;
      const remains = (value - factValue).toFixed(2);
      const percent = ((factValue / value) * 100).toFixed(1);

      return {
        ...item,
        _computed: {
          factValue,
          remains,
          percent,
        },
      };
    });

    const sum = filteredVolumes
      .reduce((acc, curr) => acc + curr.value, 0)
      .toFixed(2);

    const totalFactValue = supportVolumes
      .reduce((acc, curr) => acc + curr._computed.factValue, 0)
      .toFixed(2);

    const totalPercent = ((totalFactValue / sum) * 100).toFixed(1);

    aggByVolume.push({
      name,
      unit,
      sum,
      fact: totalFactValue,
      percent: totalPercent,
      remains: totalFactValue > 0 ? (sum - totalFactValue).toFixed(2) : null,
      aggValue: supportVolumes.map((val) => ({
        id: val.id,
        value: val.value,
        designId: val.designId,
        brevis: val.Design.brevis,
        full_name: val.Design.full_name,
        mark: val.Design.mark,
        fact: val._computed.factValue,
        remains: val._computed.remains,
        percent: val._computed.percent,
      })),
    });
  }
  return aggByVolume;
}
export function aggregationByDesign(volumes) {
  if (!volumes) return [];
  // console.log(volumes);
  const aggByDesign = [];
  const desIdMap = new Map();
  // Группируем volumes по designId
  // const resIdDesign = new Set(volumes.map((vol) => vol.Design.id));

  for (const volume of volumes) {
    // Проверим если факт у объемаs
    const factValue = volume?.Fact?.values ? totalFact(volume.Fact.values) : 0;
    const remains = (volume.value - factValue).toFixed(2);
    const percent = ((factValue / volume.value) * 100).toFixed(1);
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
      fact: factValue.toFixed(2),
      sum: volume.value,
      remains,
      percent,
      id: volume.id,
    });
  }

  // Преобразуем Map в массив
  for (const group of desIdMap.values()) {
    aggByDesign.push(group);
  }

  return aggByDesign;
}
