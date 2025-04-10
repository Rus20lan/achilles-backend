import { Design } from "../models/associations.js";
import { getRequestQueryObject } from "../services/commonService.js";

// Получить все комплекты
export const getAllDesign = async (req, res) => {
  try {
    const designs = await Design.findAll();
    if (designs.length === 0) {
      return res
        .status(404)
        .json({ success: false, data: [], message: "Not found" });
    }
    return res.status(200).json({ success: true, data: designs });
  } catch (error) {
    const message = error.message ?? "Ошибка на сервере";
    res.status(500).json({ error: message });
  }
};

export async function getDesignsByPage(req, res) {
  try {
    const { page = 1, limit = 10 } = getRequestQueryObject(req, [
      "page",
      "limit",
    ]);
    const offset = (page - 1) * limit;
    const { count, rows } = await Design.findAndCountAll({ limit, offset });

    if (rows.length === 0) {
      return res.status(404).json({ success: false, data: [] });
    }
    const totalPages = Math.ceil(count / limit);

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
