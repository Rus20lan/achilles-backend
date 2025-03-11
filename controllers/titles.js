import { Title } from '../models/associations.js';

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
