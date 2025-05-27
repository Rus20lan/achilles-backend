import { Fact, Volume, Resource, Design } from '../models/associations.js';
import {
  getEntitysByPage,
  getRequestQueryObject,
} from '../services/commonService.js';

export const getAllFacts = async (req, res) => {
  try {
    const facts = await Fact.findAll();
    if (facts.length === 0) {
      return res.status(404).json({ success: false, data: [] });
    }
    return res.status(200).json({ success: true, data: facts });
  } catch (error) {
    console.error('Ошибка при выборке факта: ', error);
    const message = error.message ?? 'Ошибка на сервере';
    res.status(500).json({ error: message });
  }
};

export async function getFactsByPage(req, res) {
  try {
    const { page = 1, limit = 10 } = getRequestQueryObject(req, [
      'page',
      'limit',
    ]);
    const result = await Fact.findAll();

    if ('error' in result) {
      throw new Error(result.error.message || 'Unknown error');
    }

    if (result.length !== 0) {
      const combinedArray = result
        .flatMap((obj) => obj.values)
        .sort((a, b) => new Date(b.dateString) - new Date(a.dateString));
      const volumeIds = result.map((item) => ({
        volumeId: item.volumeId,
        factId: item.id,
      }));
      const uniqueVolId = new Map();
      for (const { volumeId, factId } of volumeIds) {
        if (!uniqueVolId.has(volumeId)) {
          const volume = await Volume.findOne({
            where: { id: volumeId },
            include: [
              {
                model: Resource,
                attributes: ['name', 'unit'],
              },
              { model: Design, attributes: ['brevis'] },
            ],
            raw: true,
          });
          uniqueVolId.set(volumeId, {
            factId,
            value: volume.value,
            titleId: volume.titleId,
            resourceId: volume.resourceId,
            designId: volume.designId,
            name: volume['Resource.name'],
            unit: volume['Resource.unit'],
            brevis: volume['Design.brevis'],
          });
        }
      }

      const resultArray = combinedArray.map((item, index) => {
        const comb = uniqueVolId.get(item.volumeId);
        return {
          ...item,
          ...comb,
          valueId: item.id,
          factId: comb.factId,
        };
      });

      const totalItems = resultArray.length;
      const totalPages = Math.ceil(totalItems / limit);

      return res.status(200).json({
        success: true,
        data: resultArray,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      });
    } else {
      return res.status(200).json({
        success: true,
        data: null,
        isEmpty: true,
        pagination: null,
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
