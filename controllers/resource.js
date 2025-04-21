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
export async function updateResource(req, res) {}
export async function deleteResource(req, res) {}
