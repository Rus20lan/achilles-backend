import { Title } from "../models/associations.js";
import { getRequestQueryObject } from "../services/commonService.js";

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
  try {
    const { page = 1, limit = 10 } = getRequestQueryObject(req, [
      "page",
      "limit",
    ]);
    // const page = parseInt(req.query.page) || 1; // Текущая страница
    // const limit = parseInt(req.query.limit) || 10; // Элементов на странице
    const offset = (page - 1) * limit; // Отступ(смещение) начальная точка

    const { count, rows } = await Title.findAndCountAll({
      order: [["titleID", "ASC"]],
      limit,
      offset,
    });

    if (rows.length === 0) {
      return res.status(404).json({ success: false, data: [] });
    }

    const totalPages = Math.ceil(count / limit); // Количество страниц

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        totalItems: count,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Ошибка при выборе факта: ", error);
    const message = error.message ?? "Ошибка на сервере";
    res.status(500).json({ succes: false, error: message });
  }
}
