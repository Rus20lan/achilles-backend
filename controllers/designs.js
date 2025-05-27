import { Design } from '../models/associations.js';
import {
  getEntitysByPage,
  getRequestQueryObject,
} from '../services/commonService.js';

// Получить все комплекты
export const getAllDesign = async (req, res) => {
  try {
    const designs = await Design.findAll();
    if (designs.length === 0) {
      return res
        .status(404)
        .json({ success: false, data: [], message: 'Not found' });
    }
    return res.status(200).json({ success: true, data: designs });
  } catch (error) {
    const message = error.message ?? 'Ошибка на сервере';
    res.status(500).json({ error: message });
  }
};

export async function getDesignsByPage(req, res) {
  const count = await Design.count();
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
    Design,
    ['page', 'limit'],
    [['id', 'ASC']]
  );
}

export async function getDesignBrevis(req, res) {
  try {
    const designs = await Design.findAll({
      attributes: ['id', 'brevis'],
      // where: { active: true },
      order: [['id', 'ASC']],
      raw: true,
    });
    if (designs.length === 0)
      return res
        .status(404)
        .json({ succes: false, data: [], message: 'Not Found' });
    return res
      .status(200)
      .json({ succes: true, data: designs, message: 'Успешно' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ succes: false, data: [], error: error.message });
  }
}
