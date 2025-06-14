import { Design, Resource, Title, Volume } from '../models/associations.js';
import {
  filterEntities,
  getRequestQueryObject,
} from '../services/commonService.js';

export const getAllVolumes = async (req, res) => {
  try {
    const volumes = await Volume.findAll();
    if (volumes.length === 0) {
      return res
        .status(404)
        .json({ succes: false, data: [], message: 'Not Found' });
    }
    return res.status(200).json({ succes: true, data: volumes });
  } catch (error) {
    console.error('Ошибка при выборке ресурсов: ', error);
    const message = error.message ?? 'Ошибка на сервере';
    res.status(500).json({ error: message });
  }
};

export async function getVolumesByPage(req, res) {
  try {
    const { page = 1, limit = 10, filter = null } = getRequestQueryObject(req);
    const where = filter ? filterEntities(model, filter) : null;
    const correctCount = where
      ? await Volume.count({ where })
      : await Volume.count();
    if (correctCount === 0)
      return res.status(404).json({
        success: false,
        data: null,
        message: 'По данным критериям ничего не найдено',
      });
    const totalPages = Math.ceil(correctCount / limit);
    const offset = page > totalPages ? (page - 2) * limit : (page - 1) * limit;
    const { count, rows } = await Volume.findAndCountAll({
      ...(where && { where }),
      include: [
        {
          model: Title,
          attributes: ['brevis', 'full_name'],
        },
        {
          model: Design,
          attributes: ['brevis', 'full_name', 'code'],
        },
        {
          model: Resource,
          attributes: ['name', 'unit'],
        },
      ],
      order: [['id', 'ASC']],
      limit,
      offset,
    });
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, data: null, message: 'Not found' });
    }
    const correctPage = page > totalPages ? page - 1 : page;
    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        page: correctPage,
        limit,
        totalItems: count,
        totalPages,
        hasNextPage: correctPage < totalPages,
        hasPrevPage: correctPage > 1,
      },
    });
  } catch (error) {
    console.error('Ошибка при выбора объема: ', error);
    const message = error.message ?? 'Ошибка на сервере';
    res.status(500).json({ succes: false, error: message });
  }
}
