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
  return await getEntitysByPage(req, res, Resource, ['page', 'limit']);
}
