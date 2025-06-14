import { Title } from '../models/associations.js';
import { getEntitysByPage, getBrevis } from '../services/commonService.js';

export async function getAllTitles(req, res) {
  try {
    const result = await Title.findAll();
    if (result) {
      res.status(200).json({ data: result });
    } else {
      res.status(404).json({ data: [] });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Функция для реализации пагинации на backend
export async function getTitlesByPage(req, res) {
  const count = await Title.count();
  if (count === 0) {
    return res.status(200).json({
      success: true,
      data: null,
      isEmpty: true,
      pagination: null,
    });
  }
  return await getEntitysByPage(req, res, Title, [['titleID', 'ASC']]);
}

export async function getTitleBrevis(req, res) {
  return await getBrevis(Title, res, ['titleID', 'brevis'], 'titleID');
}
