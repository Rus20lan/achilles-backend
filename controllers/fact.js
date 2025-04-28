import { Fact, Volume, Resource, Design } from "../models/associations.js";
import { validateFactValuesAndNewFact } from "../services/factService.js";
//  Функция для получения Fact из таблицы Facts по внешнему ключу volumeId
export async function setFact(req, res) {
  try {
    const { factsArray } = req.body; // Получаем массив с фактами для сохранения или обновления в базе
    if (!factsArray) {
      res.status(400).json({ message: "Данные для сохранения не переданы" });
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
        //  Здесь производится валидация полученных данных с данными из БД на предмет повторных данных
        prevFact.values = validateFactValuesAndNewFact(prevFact.values, fact)
          ? [...prevFact.values]
          : [...prevFact.values, fact];
        prevFact.volumeId = fact.volumeId;
        await prevFact.save(); // Сохраняем изменения
      } else {
        await Fact.create({
          // id: fact.id,
          values: [fact],
          volumeId: fact.volumeId,
        });
      }
    }
    res.status(200).json({
      message: "Данные успешно сохранены или обновлены",
      data: factsArray,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Есть ошибка" });
  }
}

export async function getFactInValuesField(req, res) {
  // Нужно из request получить id - строки из таблицы facts и  id - из поля values
  try {
    const { id, idValue } = req.params;
    const fact = await Fact.findByPk(+id, { raw: true });
    if (!fact) {
      return res.status(404).json({
        success: false,
        data: [],
        message: `Для факта с id ${id} данные не найдены`,
      });
    }
    const values = fact.values.filter((fact) => fact.id === +idValue);
    if (values.length === 0) {
      return res.status(404).json({
        success: false,
        data: [],
        message: `Запись в поле values с id ${idValue} не найдена`,
      });
    }
    // Добавляем данные по ресурсу (id, name) и документации (id, brevis)
    const volume = await Volume.findByPk(values[0].volumeId, {
      include: [
        { model: Resource, attributes: ["id", "name", "unit"] },
        { model: Design, attributes: ["id", "brevis"] },
      ],
      raw: true,
    });

    res.status(200).json({
      success: true,
      data: {
        id: +id,
        valueId: values[0].id,
        value: volume.value,
        fact: values[0].fact,
        dateString: values[0].dateString,
        volumeId: values[0].volumeId,
        name: volume["Resource.name"],
        resourceId: volume["Resource.id"],
        brevis: volume["Design.brevis"],
        designId: volume["Design.id"],
      },
    });
  } catch (error) {
    const message = error.message ?? "Ошибка на сервере";
    res.status(500).json({ error: message });
  }
}

export async function updateFact(req, res) {
  const { id, idValue } = req.params;
  const updateFact = req.body;
  const fact = await Fact.findByPk(+id, { raw: true });
}
