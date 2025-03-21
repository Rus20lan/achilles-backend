import Fact from "../models/Fact.js";

export function validateFactValuesAndNewFact(valuesInBD, fact) {
  const foundFact = valuesInBD.find(
    (item) => item.dateString === fact.dateString && item.fact === fact.fact
  );
  if (foundFact) {
    return true;
  } else {
    return false;
  }
}

// export class FactService {
//   constructor() {
//     this.values = null;
//     this.id = null;
//     this.volumeId = null;
//     this.isSave = false;
//   }
//   async getFactByVolumeId(volumeId) {
//     try {
//       const fact = await Fact.findOne({
//         where: { volumeId },
//         attributes: ["id", "values", "volumeId"],
//       });
//       console.log(fact);
//       if (!fact) {
//         this.isSave = true;
//         return null;
//       }
//       const plainFact = fact.get({ plain: true });
//       Object.assign(this, plainFact);
//       return plainFact;
//     } catch (error) {
//       throw error; // пробрасываем ошибку выше
//     }
//   }
// }

// export async function getFactByVolumeId(volumeId) {
//   try {
//     const fact = await Fact.findOne({
//       where: { volumeId },
//       attributes: [id, values, volumeId],
//     });
//     console.log(fact);
//     const plainFact = fact.get({ plain: true });
//     if (plainFact) {
//       const { id, values } = plainFact;
//       return { id, values };

//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error?.message });
//   }
// }
