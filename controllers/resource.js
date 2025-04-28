import { Resource } from "../models/associations.js";

async function getResource(id) {
  const resource = await Resource.findByPk(+id, { raw: true });
  if (!resource) {
    throw new Error(`Ресурс с id ${id} не найден`);
  }
  return resource;
}

export async function getResourceById(req, res) {
  try {
    const { id } = req.params;
    const resource = await getResource(id);
    res.status(200).json({ data: resource });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Ошибка на сервере",
      code: error.code,
    });
  }
}
export async function saveResource(req, res) {}
export async function updateResource(req, res) {
  try {
    const { id } = req.params;
    const updateResource = req.body;
    const [affectedRows] = await Resource.update(updateResource, {
      where: { id: +id },
      returning: true,
    });
    if (affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Ресурс не найден" });
    }

    const updatedResource = await Resource.findByPk(+id);

    res.status(200).json({
      success: true,
      data: updatedResource,
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
export async function deleteResource(req, res) {}
