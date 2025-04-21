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
export async function updateDesign(req, res) {}
export async function deleteDesign(req, res) {}
