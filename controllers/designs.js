import { Design } from "../models/associations.js";

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
