import Fact from '../models/Fact.js';

//  Функция для получения Fact из таблицы Facts по внешнему ключу volumeId
export async function getFactByVolumeId(req, res) {
  try {
    const { volumeId } = req.params;
    const fact = await Fact.findOne({ where: { volumeId } }).fact;
    res.status(200).json(fact);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error?.message });
  }
}
