import { Design } from "../models/associations.js";

async function getDesign(id) {
  const design = await Design.findByPk(+id, { raw: true });
  if (!design) {
    throw new Error(`Документация с id ${id} не найдена`);
  }
  return design;
}

export async function getDesignById(req, res) {
  try {
    const { id } = req.params;
    const design = await getDesign(id);
    res.status(200).json({ data: design });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Ошибка на сервере",
      code: error.code,
    });
  }
}
export async function saveDesign(req, res) {}
export async function updateDesign(req, res) {
  try {
    const { id } = req.params;
    const updateDesign = req.body;
    const [affectedRows] = await Design.update(updateDesign, {
      where: { id: +id },
      returning: true,
    });
    if (affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Проект не найден" });
    }

    const updatedDesign = await Design.findByPk(+id);

    res.status(200).json({
      success: true,
      data: updatedDesign,
      message: "Успешное обновление",
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        success: false,
        data: [],
        message: error.errors.map((e) => e.message),
      });
    }
    res.status(500).json({
      success: false,
      data: [],
      error: error.message,
    });
  }
}
export async function deleteDesign(req, res) {}
