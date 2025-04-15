import { Fact } from "../models/associations.js";
import { getEntitysByPage } from "../services/commonService.js";

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

export async function getFactsByPage(req, res) {
  try {
    const result = await getAllFacts(req, res);

    if ("error" in result) {
      throw new Error(result.error.message || "Unknown error");
    }
    console.log(result);
    if (result?.success) {
      const combinedArray = result.flatMap((obj) => obj.values);
      return res.status(200).json({
        success: true,
        data: combinedArray,
        pagination: {
          page: 1,
          limit: 10,
          totalItems: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
  // return await getEntitysByPage(req, res, Fact, ["page", "limit"]);
}
