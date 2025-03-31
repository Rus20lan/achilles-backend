import { Resource, Title, Volume } from "../models/associations.js";
import Design from "../models/Design.js";
import Fact from "../models/Fact.js";
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
