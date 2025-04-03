import { Fact } from "../models/associations.js";

export const getAllFacts = async (req, res) => {
  try {
    const facts = await Fact.findAll();
    if (facts.length === 0) {
      return res.status(404).json({ success: false, data: [] });
    }
    return res.status(200).json({ success: true, data: facts });
  } catch (error) {
    console.error("Ошибка при выборке факта: ", error);
    const message = error.message ?? "Ошибка на сервере";
    res.status(500).json({ error: message });
  }
};
