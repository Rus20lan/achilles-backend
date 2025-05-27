import { Resource } from '../models/associations.js';
import { getEntitysByPage } from '../services/commonService.js';

export const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.findAll();
    if (resources.length === 0) {
      return res
        .status(404)
        .json({ success: false, data: [], message: 'Not Found' });
    }
    return res.status(200).json({ success: true, data: resources });
  } catch (error) {
    console.error('Ошибка при выборке ресурсов: ', error);
    const message = error.message ?? 'Ошибка на сервере';
    res.status(500).json({ error: message });
  }
};

export async function getResourcesByPage(req, res) {
  const count = await Resource.count();
  if (count === 0) {
    return res.status(200).json({
      success: true,
      data: null,
      isEmpty: true,
      pagination: null,
    });
  }
  return await getEntitysByPage(
    req,
    res,
    Resource,
    ['page', 'limit'],
    [['id', 'ASC']]
  );
}

export async function getResourcesName(req, res) {
  try {
    const resources = await Resource.findAll({
      attributes: ['id', 'name'],
      order: [['id', 'ASC']],
      raw: true,
    });
    if (resources.length === 0)
      return res
        .status(404)
        .json({ succes: false, data: [], message: 'Not Found' });
    return res
      .status(200)
      .json({ succes: true, data: resources, message: 'Успешно' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ succes: false, data: [], error: error.message });
  }
}
