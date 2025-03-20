import { where } from 'sequelize';
import Fact from '../models/Fact.js';
//  Функция для получения Fact из таблицы Facts по внешнему ключу volumeId
export async function setFact(req, res) {
  try {
    const { factsArray } = req.body; // Получаем массив с фактами для сохранения или обновления в базе
    if (!factsArray) {
      res.status(400).json({ message: 'Данные для сохранения не переданы' });
      return;
    }
    // Здесь будет происходить сохранение в базе данных факта
    for (const fact of factsArray) {
      // Необходимо найти fact в БД по внешнему ключу volumeId
      const prevFact = await Fact.findOne({
        where: { volumeId: fact.volumeId },
      });
      if (prevFact) {
        // const values = JSON.parse(JSON.stringify(prevFact.values));
        prevFact.values = [...prevFact.values, fact];
        prevFact.volumeId = fact.volumeId;
        await prevFact.save(); // Сохраняем изменения
      } else {
        await Fact.create({
          id: fact.id,
          values: [fact],
          volumeId: fact.volumeId,
        });
      }
    }
    res.status(200).json({
      message: 'Данные успешно сохранены или обновлены',
      data: factsArray,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Есть ошибка' });
  }
}
