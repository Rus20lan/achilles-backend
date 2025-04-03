import { Volume } from "../models/associations.js";

export const getAllVolumes = async (req, res) => {
  try {
    const volumes = await Volume.findAll();
    if (volumes.length === 0) {
      return res
        .status(404)
        .json({ succes: false, data: [], message: "Not Found" });
    }
    return res.status(200).json({ succes: true, data: volumes });
  } catch (error) {
    console.error("Ошибка при выборке ресурсов: ", error);
    const message = error.message ?? "Ошибка на сервере";
    res.status(500).json({ error: message });
  }
};
