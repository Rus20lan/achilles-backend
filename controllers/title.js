import {
  Resource,
  Title,
  Volume,
  Design,
  Fact,
} from "../models/associations.js";
// import Design from "../models/Design.js";
// import Fact from "../models/Fact.js";
import {
  aggregationByDesign,
  aggregationByVolume,
} from "../services/titleService.js";

export async function getTitleById(req, res) {
  try {
    const { id } = req.params;

    const title = await Title.findOne({
      where: { titleID: id },
      include: [
        {
          model: Volume,
          as: "volumes",
          include: [
            { model: Resource, attributes: ["name", "unit"] },
            { model: Design },
            { model: Fact, attributes: ["id", "values"] },
          ],
        },
      ],
    });

    // console.log(title.get({ plain: true }));
    const titleWithAggregatedVolumes = {
      ...title.get({ plain: true }),
      aggByVolume: aggregationByVolume(title.get({ plain: true }).volumes),
      aggByDesign: aggregationByDesign(title.get({ plain: true }).volumes),
    };
    res.status(200).json({ data: titleWithAggregatedVolumes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
}

export async function saveTitle(req, res) {}
export async function updateTitle(req, res) {
  try {
    const { id } = req.params;
    const updateTitle = req.body;
    console.log(updateTitle);
    const [affectedRows] = await Title.update(updateTitle, {
      where: { titleID: +id },
      returning: true,
    });

    console.log(affectedRows);

    if (affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Титул не найден" });
    }

    const updatedTitle = await Title.findByPk(+id);

    res.status(200).json({
      success: true,
      data: updatedTitle,
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
export async function deleteTitle(req, res) {}
